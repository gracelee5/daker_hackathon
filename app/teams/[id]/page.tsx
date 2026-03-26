'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, MessageCircle, Send, Crown, UserMinus,
  ChevronLeft, Zap, CheckCircle, XCircle, ExternalLink,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { getPublicTeams, getHackathonBySlug } from '@/lib/data';
import { Team, TeamMember, ChatMessage, TeamJoinRequest, HackathonParticipation } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { LoadingSpinner, EmptyState } from '@/components/common/StatusUI';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TeamDetailPage({ params }: Props) {
  const { id: teamCode } = use(params);
  const router = useRouter();
  const { user, addNotification } = useAuthStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [memberBios, setMemberBios] = useState<Record<string, string>>({});
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [pendingRequests, setPendingRequests] = useState<TeamJoinRequest[]>([]);
  const [participation, setParticipation] = useState<HackathonParticipation | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 팀 찾기: localStorage 우선, 없으면 JSON
    const localTeams = storage.getTeams();
    const found = localTeams.find((t) => t.teamCode === teamCode)
      ?? getPublicTeams().find((t) => t.teamCode === teamCode)
      ?? null;
    setTeam(found);

    if (found) {
      const storedMembers = storage.getTeamMembers(teamCode);
      setMembers(storedMembers);
      // 멤버 bio 조회
      const users = storage.getUsers();
      const bios: Record<string, string> = {};
      storedMembers.forEach((m) => {
        const u = users.find((u) => u.id === m.userId);
        if (u?.bio) bios[m.userId] = u.bio;
      });
      setMemberBios(bios);
      setChats(storage.getChats(teamCode));
      setPendingRequests(storage.getJoinRequestsForTeam(teamCode).filter((r) => r.status === 'pending'));

      // 팀 참여 이력 확인
      const parts = storage.getParticipations();
      const teamPart = parts.find(
        (p) => p.teamCode === teamCode && p.hackathonSlug === found.hackathonSlug
      ) ?? null;
      setParticipation(teamPart);
    }
    setLoading(false);
  }, [teamCode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  if (loading) return <LoadingSpinner />;
  if (!team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState title="팀을 찾을 수 없습니다" description="존재하지 않거나 삭제된 팀입니다." />
      </div>
    );
  }

  const hackathon = getHackathonBySlug(team.hackathonSlug);
  const isLeader = user
    ? team.leaderId === user.id || members.some((m) => m.userId === user.id && m.isLeader)
    : false;
  const isMember = user ? members.some((m) => m.userId === user.id) : false;

  const handleSendChat = () => {
    if (!user || !chatInput.trim()) return;
    const msg: ChatMessage = {
      id: `chat-${Date.now()}`,
      teamCode,
      userId: user.id,
      userNickname: user.nickname,
      content: chatInput.trim(),
      createdAt: new Date().toISOString(),
    };
    storage.addChat(msg);
    setChats((prev) => [...prev, msg]);
    setChatInput('');

    // 다른 팀원에게 채팅 알림
    members
      .filter((m) => m.userId !== user.id)
      .forEach((m) => {
        addNotification({
          userId: m.userId,
          type: 'team_chat',
          title: `${team?.name ?? teamCode} 채팅`,
          message: `${user.nickname}: ${chatInput.trim()}`,
          data: { teamCode, teamName: team?.name },
        });
      });
  };

  const handleApprove = (req: TeamJoinRequest) => {
    storage.updateJoinRequestStatus(req.id, 'accepted');
    const newMember: TeamMember = {
      teamCode,
      userId: req.fromUserId,
      nickname: req.fromUserNickname,
      role: req.fromUserPositions[0] ?? 'Frontend',
      joinedAt: new Date().toISOString(),
      isLeader: false,
    };
    storage.addTeamMember(newMember);
    setMembers((prev) => [...prev, newMember]);
    setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));

    // 솔로 참여 → 팀 참여 전환
    if (team.hackathonSlug) {
      storage.convertToTeamParticipation(
        req.fromUserId,
        team.hackathonSlug,
        teamCode,
        team.name
      );
    }

    addNotification({
      userId: req.fromUserId,
      type: 'request_accepted',
      title: '팀 합류 수락',
      message: `${team.name} 팀에 합류가 수락되었습니다!`,
      data: { teamCode, teamName: team.name },
    });
  };

  const handleReject = (req: TeamJoinRequest) => {
    storage.updateJoinRequestStatus(req.id, 'rejected');
    setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
    addNotification({
      userId: req.fromUserId,
      type: 'request_rejected',
      title: '팀 합류 거절',
      message: `${team.name} 팀 합류 요청이 거절되었습니다.`,
      data: { teamCode, teamName: team.name },
    });
  };

  const handleKick = (member: TeamMember) => {
    storage.removeTeamMember(teamCode, member.userId);
    setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> 뒤로
      </button>

      {/* 팀 헤더 */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{team.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                team.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {team.isOpen ? '모집중' : '마감'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{team.intro || '팀 소개가 없습니다.'}</p>
            <div className="flex flex-wrap gap-2">
              {team.lookingFor.map((pos) => (
                <Badge key={pos}>{pos}</Badge>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">팀원</p>
            <p className="text-xl font-bold text-violet-600">
              {members.length > 0 ? members.length : team.memberCount}
              <span className="text-sm text-gray-400">/{team.maxMembers}</span>
            </p>
          </div>
        </div>

        {/* 해커톤 정보 */}
        {hackathon && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <Zap className="h-4 w-4 text-violet-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Link href={`/hackathons/${hackathon.slug}`} className="text-sm font-medium text-violet-700 hover:underline line-clamp-1">
                {hackathon.title}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="status" status={hackathon.status} />
                <span className="text-xs text-gray-400">
                  마감 {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 해커톤 참여 상태 */}
        {participation && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              participation.submitted
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-violet-50 text-violet-700'
            }`}>
              {participation.submitted ? '제출 완료' : '해커톤 참여 중'}
            </span>
            {participation.submittedAt && (
              <span className="text-xs text-gray-400">
                {new Date(participation.submittedAt).toLocaleDateString('ko-KR')} 제출
              </span>
            )}
          </div>
        )}

        {/* 연락처 */}
        {team.contact?.url && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={team.contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> 연락처 / 오픈채팅
            </a>
          </div>
        )}
      </Card>

      {/* 팀원 목록 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <Users className="h-4 w-4 text-violet-500" /> 팀원 ({members.length > 0 ? members.length : team.memberCount}명)
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">멤버 정보가 없습니다.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((member) => (
              <div key={member.userId} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {member.isLeader
                        ? <Crown className="h-5 w-5 text-amber-500" />
                        : <span className="text-sm font-bold text-violet-500">{member.nickname[0]}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{member.nickname}</p>
                        {member.isLeader && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">팀장</span>
                        )}
                      </div>
                      <p className="text-xs text-violet-600 font-medium mt-0.5">{member.role}</p>
                      {memberBios[member.userId] && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{memberBios[member.userId]}</p>
                      )}
                    </div>
                  </div>
                  {isLeader && !member.isLeader && user?.id !== member.userId && (
                    <button
                      onClick={() => handleKick(member)}
                      className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      title="내보내기"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 팀장: 대기 중인 합류 요청 */}
      {isLeader && pendingRequests.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <Users className="h-4 w-4 text-violet-500" /> 합류 요청 ({pendingRequests.length})
          </div>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-gray-200 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{req.fromUserNickname}</p>
                    <p className="text-xs text-gray-500">{req.fromUserBio || '소개 없음'}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {req.fromUserPositions.map((pos) => (
                        <Badge key={pos}>{pos}</Badge>
                      ))}
                    </div>
                    {req.message && (
                      <p className="text-xs text-gray-600 mt-1 bg-gray-50 rounded px-2 py-1">{req.message}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(req)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> 수락
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> 거절
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 팀 채팅 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <MessageCircle className="h-4 w-4 text-violet-500" /> 팀 채팅
        </div>
        <div className="h-64 overflow-y-auto rounded-xl bg-gray-50 p-3 mb-3 space-y-2">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">첫 메시지를 남겨보세요.</p>
          ) : (
            chats.map((msg) => {
              const isMe = user?.id === msg.userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                    isMe ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {!isMe && (
                      <p className="text-xs font-medium text-violet-600 mb-0.5">{msg.userNickname}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-[10px] mt-0.5 ${isMe ? 'text-violet-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>
        {user ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <Button onClick={handleSendChat} disabled={!chatInput.trim()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">
            <Link href="/auth/login" className="text-violet-600 hover:underline">로그인</Link> 후 채팅에 참여하세요.
          </p>
        )}
      </Card>
    </div>
  );
}
