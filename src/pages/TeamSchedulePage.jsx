import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useToast } from '../hooks/useToast.js';
import { apiGet } from '../api/client.js';
import SchedulingAssistant from '../components/scheduling/SchedulingAssistant.jsx';

export default function TeamSchedulePage() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [teamRes, dlRes] = await Promise.all([
          apiGet(`/api/teams/${id}`),
          apiGet('/api/deadlines').catch(() => ({ data: [] })),
        ]);
        setTeam(teamRes?.data || null);
        setDeadlines(dlRes?.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load team');
        showToast?.(e?.message || 'Failed to load team');
      } finally { setLoading(false); }
    })();
  }, [id, showToast]);

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div className="skeleton" style={{ width: 300, height: 32, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 400 }} />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: theme.textSecondary }}>{error || 'Team not found'}</p>
        <Link to="/teams" style={{ color: theme.accent }}>Back to teams</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <Link to="/teams" style={{
            fontSize: 12, color: theme.textTertiary,
            textDecoration: 'none', display: 'inline-block', marginBottom: 4,
          }}>← Back to teams</Link>
          <h1 style={{
            fontSize: theme.font.headingXl, fontWeight: 600,
            color: theme.textPrimary, margin: 0,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: team.color || theme.accent,
            }} />
            {team.name}
          </h1>
        </div>
        <button
          onClick={() => navigate(`/teams?id=${id}`)}
          style={{
            padding: '7px 14px', borderRadius: 8,
            background: 'none', border: `0.5px solid ${theme.border}`,
            color: theme.textPrimary, fontSize: 12,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Team info</button>
      </div>

      <SchedulingAssistant team={team} deadlines={deadlines} />
    </div>
  );
}
