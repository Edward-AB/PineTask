import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import useTeams from '../hooks/useTeams.js';
import { useMessaging } from '../context/MessagingContext.jsx';
import { apiGet } from '../api/client.js';
import TeamSelector from '../components/teams/TeamSelector.jsx';
import TeamInfoCard from '../components/teams/TeamInfoCard.jsx';
import MemberList from '../components/teams/MemberList.jsx';
import InviteSection from '../components/teams/InviteSection.jsx';
import TeamProjectsList from '../components/teams/TeamProjectsList.jsx';
import TeamTasksList from '../components/teams/TeamTasksList.jsx';

const COLOR_CHOICES = ['#3B6D11', '#8B4513', '#C8721A', '#3A7D44', '#5A3FAF', '#111111'];

export default function TeamsPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { startAndOpen } = useMessaging();
  const {
    teams, loading, error,
    createTeam, updateTeam, deleteTeam, leaveTeam,
    inviteMember, removeMember, updateMemberRole,
    fetchTeams,
  } = useTeams();

  const [selectedId, setSelectedId] = useState(params.get('id') || null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState(COLOR_CHOICES[0]);
  const [teamDetail, setTeamDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Initial selection: prefer param, else first team
  useEffect(() => {
    if (!teams.length) return;
    if (selectedId && teams.some((t) => t.id === selectedId)) return;
    setSelectedId(teams[0].id);
  }, [teams, selectedId]);

  useEffect(() => {
    if (selectedId) setParams({ id: selectedId }, { replace: true });
  }, [selectedId, setParams]);

  const fetchDetail = useCallback(async (id) => {
    if (!id) { setTeamDetail(null); return; }
    try {
      setLoadingDetail(true);
      const res = await apiGet(`/api/teams/${id}`);
      setTeamDetail(res?.data || null);
    } catch (e) {
      showToast?.(e?.message || 'Failed to load team');
      setTeamDetail(null);
    } finally { setLoadingDetail(false); }
  }, [showToast]);

  useEffect(() => { fetchDetail(selectedId); }, [selectedId, fetchDetail]);

  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedId), [teams, selectedId]);
  const canEdit = teamDetail?.user_role === 'owner' || teamDetail?.user_role === 'admin';
  const canInvite = canEdit;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const t = await createTeam(newName.trim(), newDesc, newColor);
      setShowCreate(false);
      setNewName(''); setNewDesc(''); setNewColor(COLOR_CHOICES[0]);
      if (t?.id) setSelectedId(t.id);
    } catch (e) {
      showToast?.(e?.message || 'Failed to create team');
    }
  };

  const handleSaveInfo = async (updates) => {
    try {
      await updateTeam(selectedId, updates);
      fetchDetail(selectedId);
    } catch (e) {
      showToast?.(e?.message || 'Failed to save team');
    }
  };

  const handleDeleteTeam = async (confirmName) => {
    try {
      await deleteTeam(selectedId, confirmName);
      setSelectedId(null);
      setTeamDetail(null);
    } catch (e) {
      showToast?.(e?.message || 'Failed to delete team');
    }
  };

  const handleLeave = async () => {
    if (!confirm(`Leave "${selectedTeam?.name}"?`)) return;
    try {
      await leaveTeam(selectedId, user?.id);
      setSelectedId(null);
      setTeamDetail(null);
    } catch (e) {
      showToast?.(e?.message || 'Failed to leave team');
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await removeMember(selectedId, userId);
      fetchDetail(selectedId);
      fetchTeams();
    } catch (e) {
      showToast?.(e?.message || 'Failed to remove member');
    }
  };

  const handleChangeRole = async (userId, role) => {
    try {
      await updateMemberRole(selectedId, userId, role);
      fetchDetail(selectedId);
    } catch (e) {
      showToast?.(e?.message || 'Failed to update role');
    }
  };

  const handleInvite = async (email) => {
    try {
      const res = await inviteMember(selectedId, email);
      showToast?.('Invite sent');
      return res;
    } catch (e) {
      throw new Error(e?.message || 'Failed to send invite');
    }
  };

  const handleMessage = async (member) => {
    try {
      await startAndOpen(selectedId, member.id);
    } catch (e) {
      showToast?.(e?.message || 'Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div className="skeleton" style={{ width: 200, height: 28, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 200 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
          Teams
        </h1>
        {selectedTeam && (
          <button
            onClick={() => navigate(`/teams/${selectedId}/schedule`)}
            style={{
              padding: '8px 16px', borderRadius: 8,
              background: theme.accentBtn, color: theme.accentBtnText,
              border: 'none', fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Schedule assistant
          </button>
        )}
      </div>

      {error && (
        <div style={{
          background: theme.bgSecondary, border: `0.5px solid ${theme.danger}`,
          borderRadius: 10, padding: 12, color: theme.danger,
          fontSize: 12, marginBottom: 16,
        }}>{error}</div>
      )}

      {teams.length === 0 && !showCreate ? (
        <EmptyTeams onCreate={() => setShowCreate(true)} />
      ) : (
        <TeamSelector
          teams={teams}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={() => setShowCreate(true)}
        />
      )}

      {showCreate && (
        <form onSubmit={handleCreate} style={{
          background: theme.bgSecondary,
          border: `0.5px solid ${theme.border}`,
          borderRadius: 14, padding: 14, marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>New team</div>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Team name" autoFocus
            style={inputStyle(theme)} />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)"
            style={inputStyle(theme)} />
          <div style={{ display: 'flex', gap: 6 }}>
            {COLOR_CHOICES.map((c) => (
              <button key={c} type="button" onClick={() => setNewColor(c)} style={{
                width: 22, height: 22, borderRadius: '50%',
                background: c, cursor: 'pointer',
                border: newColor === c ? `2px solid ${theme.textPrimary}` : `0.5px solid ${theme.border}`,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="submit" style={{
              background: theme.accentBtn, color: theme.accentBtnText,
              border: 'none', borderRadius: 8, padding: '7px 14px',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>Create team</button>
            <button type="button" onClick={() => setShowCreate(false)} style={{
              background: 'none', border: `0.5px solid ${theme.border}`,
              borderRadius: 8, padding: '7px 14px',
              fontSize: 12, color: theme.textPrimary, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </form>
      )}

      {selectedTeam && teamDetail && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}>
          <div>
            <TeamInfoCard
              team={teamDetail}
              canEdit={canEdit}
              onSave={handleSaveInfo}
              onDelete={handleDeleteTeam}
            />
            <MemberList
              members={teamDetail.members || []}
              userRole={teamDetail.user_role}
              onRemove={handleRemove}
              onChangeRole={handleChangeRole}
              onLeave={handleLeave}
              onMessage={handleMessage}
            />
            <InviteSection
              teamId={selectedId}
              onInvite={handleInvite}
              canInvite={canInvite}
            />
          </div>
          <div>
            <TeamProjectsList teamId={selectedId} />
            <TeamTasksList teamId={selectedId} />
          </div>
        </div>
      )}

      {selectedTeam && loadingDetail && !teamDetail && (
        <div style={{ padding: 24, textAlign: 'center', color: theme.textTertiary, fontSize: 12 }}>
          Loading team…
        </div>
      )}
    </div>
  );
}

function EmptyTeams({ onCreate }) {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px dashed ${theme.border}`,
      borderRadius: 14, padding: '40px 20px',
      textAlign: 'center',
    }}>
      <svg width={48} height={48} viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.5 }}>
        <circle cx={11} cy={12} r={3.5} stroke={theme.textTertiary} strokeWidth={1.5}/>
        <circle cx={22} cy={11} r={3} stroke={theme.textTertiary} strokeWidth={1.5}/>
        <path d="M4 24c0-3.5 3-6 7-6s7 2.5 7 6M17 23c0-2.5 2.5-5 5-5s5 2.5 5 5" stroke={theme.textTertiary} strokeWidth={1.5} strokeLinecap="round"/>
      </svg>
      <div style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, marginBottom: 6 }}>
        No teams yet
      </div>
      <div style={{ fontSize: 12, color: theme.textTertiary, marginBottom: 16 }}>
        Create a team to collaborate on projects with others.
      </div>
      <button onClick={onCreate} style={{
        background: theme.accentBtn, color: theme.accentBtnText,
        border: 'none', borderRadius: 8, padding: '8px 16px',
        fontSize: 12, fontWeight: 500, cursor: 'pointer',
      }}>Create your first team</button>
    </div>
  );
}

function inputStyle(theme) {
  return {
    fontFamily: 'inherit', fontSize: 12,
    padding: '7px 10px', borderRadius: 8,
    border: `0.5px solid ${theme.border}`,
    background: theme.surface, color: theme.textPrimary,
    outline: 'none',
  };
}
