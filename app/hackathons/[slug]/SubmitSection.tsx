'use client';

import { useState, useEffect } from 'react';
import { Upload, CheckCircle, ClipboardList, UserCheck } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { HackathonDetailSections } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface Props {
  slug: string;
  hackathonTitle: string;
  submit: HackathonDetailSections['submit'];
}

export default function SubmitSection({ slug, hackathonTitle, submit }: Props) {
  const { user, addNotification } = useAuthStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [registered, setRegistered] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    const participations = storage.getParticipations();
    const mine = participations.find((p) => p.hackathonSlug === slug);
    setRegistered(!!mine);
    setSubmitted(!!mine?.submitted);
  }, [user, slug]);

  const items = submit.submissionItems ?? [
    { key: 'main', title: '제출물', format: submit.allowedArtifactTypes[0] ?? 'url' },
  ];

  const isFileFormat = (format: string) => format === 'pdf' || format === 'zip';

  const handleRegister = () => {
    if (!user) return;
    storage.saveParticipation({
      hackathonSlug: slug,
      hackathonTitle,
      teamCode: 'solo',
      teamName: '개인 참여',
      role: '',
      status: 'ongoing',
      joinedAt: new Date().toISOString(),
    });
    addNotification({
      userId: user.id,
      type: 'hackathon_registered',
      title: '해커톤 신청 완료',
      message: `${hackathonTitle} 해커톤에 신청이 완료되었습니다.`,
      data: { hackathonSlug: slug, hackathonTitle },
    });
    setRegistered(true);
  };

  const handleSubmit = () => {
    if (!user) return;
    const teams = storage.getTeams();
    const myTeam = teams.find((t) => t.hackathonSlug === slug);
    const now = new Date().toISOString();

    storage.saveSubmission({
      id: `${slug}-${Date.now()}`,
      hackathonSlug: slug,
      teamCode: myTeam?.teamCode ?? 'solo',
      submittedAt: now,
      artifacts: {
        plan: values['plan'],
        webUrl: values['web'] || values['url'] || values['github_url'],
        pdfUrl: values['pdf'] || fileNames['pdf'],
        zipUrl: values['zip'] || fileNames['zip'],
      },
    });
    storage.markParticipationSubmitted(slug);

    // 증명서 자동 발급
    const members = storage.getTeamMembers(myTeam?.teamCode ?? '');
    const myMember = members.find((m) => m.userId === user.id);
    const role = myMember?.role || user.positions[0] || 'Participant';
    storage.saveCertificate({
      id: `cert-${slug}-${user.id}`,
      userId: user.id,
      hackathonSlug: slug,
      hackathonTitle,
      teamName: myTeam?.name ?? '개인 참여',
      role,
      issuedAt: now,
    });

    addNotification({
      userId: user.id,
      type: 'submission_complete',
      title: '제출 완료 · 증명서 발급',
      message: `${hackathonTitle} 해커톤 제출 완료! 경험 증명서가 발급되었습니다.`,
      data: { hackathonSlug: slug, hackathonTitle },
    });
    setSubmitted(true);
  };

  if (!user) {
    return (
      <Card id="submit">
        <div className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
          <Upload className="h-4 w-4 text-violet-500" /> 신청 / 제출
        </div>
        <p className="text-sm text-gray-500">로그인 후 해커톤에 신청하거나 결과물을 제출할 수 있습니다.</p>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card id="submit">
        <div className="flex flex-col items-center gap-3 py-6">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
          <p className="font-semibold text-gray-900">제출이 완료되었습니다!</p>
          <p className="text-sm text-gray-500">리더보드에 곧 반영됩니다.</p>
        </div>
      </Card>
    );
  }

  const hasInput = items.some((item) =>
    isFileFormat(item.format) ? !!fileNames[item.key] : !!values[item.key]
  );

  return (
    <Card id="submit">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
        <Upload className="h-4 w-4 text-violet-500" /> {registered ? '제출' : '신청 / 제출'}
      </div>
      <ul className="space-y-1 mb-4">
        {submit.guide.map((g, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-600">
            <span className="text-violet-400">•</span>
            {g}
          </li>
        ))}
      </ul>

      {!registered ? (
        <div className="rounded-xl bg-violet-50 border border-violet-100 p-5 text-center">
          <ClipboardList className="h-8 w-8 text-violet-400 mx-auto mb-3" />
          <p className="text-sm text-gray-700 mb-4">먼저 해커톤에 신청해 주세요.</p>
          <Button onClick={handleRegister}>
            <UserCheck className="h-4 w-4" /> 신청하기
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{item.title}</label>
                {isFileFormat(item.format) ? (
                  <input
                    type="file"
                    accept={item.format === 'pdf' ? '.pdf' : '.zip,.tar.gz'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileNames((prev) => ({ ...prev, [item.key]: file?.name ?? '' }));
                    }}
                    className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={item.format.includes('url') ? 'https://' : '내용 입력'}
                    value={values[item.key] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [item.key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={!hasInput}>
            <Upload className="h-4 w-4" /> 제출하기
          </Button>
        </>
      )}
    </Card>
  );
}
