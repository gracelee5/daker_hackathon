'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { storage } from '@/lib/storage';
import { HackathonDetailSections, Submission } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface Props {
  slug: string;
  submit: HackathonDetailSections['submit'];
}

export default function SubmitSection({ slug, submit }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const items = submit.submissionItems ?? [
    { key: 'main', title: '제출물', format: submit.allowedArtifactTypes[0] ?? 'url' },
  ];

  const handleSubmit = () => {
    const user = storage.getCurrentUser();
    const teams = storage.getTeams();
    const myTeam = teams.find((t) => t.hackathonSlug === slug);

    const sub: Submission = {
      id: `${slug}-${Date.now()}`,
      hackathonSlug: slug,
      teamCode: myTeam?.teamCode ?? 'solo',
      submittedAt: new Date().toISOString(),
      artifacts: {
        plan: values['plan'],
        webUrl: values['web'],
        pdfUrl: values['pdf'],
        zipUrl: values['zip'],
      },
    };
    storage.saveSubmission(sub);
    setSubmitted(true);
  };

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

  return (
    <Card id="submit">
      <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
        <Upload className="h-4 w-4 text-violet-500" /> 제출
      </div>
      <ul className="space-y-1 mb-4">
        {submit.guide.map((g, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-600">
            <span className="text-violet-400">•</span>
            {g}
          </li>
        ))}
      </ul>
      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{item.title}</label>
            <input
              type="text"
              placeholder={item.format.includes('url') ? 'https://' : '내용 입력'}
              value={values[item.key] ?? ''}
              onChange={(e) => setValues((prev) => ({ ...prev, [item.key]: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit}>
        <Upload className="h-4 w-4" /> 제출하기
      </Button>
    </Card>
  );
}
