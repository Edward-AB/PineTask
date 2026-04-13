import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import DeadlineItem from './DeadlineItem.jsx';
import DeadlineForm from './DeadlineForm.jsx';

export default function DeadlineList({ deadlines, tasks, projects, onAdd, onDelete, onEdit, embedded }) {
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);

  const handleEdit = (dl) => {
    setEditingDeadline(dl);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingDeadline && onEdit) {
      onEdit(editingDeadline.id, data);
    } else {
      onAdd(data);
    }
    setShowForm(false);
    setEditingDeadline(null);
  };

  // Group by project
  const grouped = {};
  const noProject = [];
  (deadlines || []).forEach(dl => {
    if (dl.project_id) {
      if (!grouped[dl.project_id]) grouped[dl.project_id] = [];
      grouped[dl.project_id].push(dl);
    } else {
      noProject.push(dl);
    }
  });

  const content = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          fontSize: theme.font.label, fontWeight: 500, color: theme.textTertiary,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>DEADLINES</div>
        <button onClick={() => setShowForm(!showForm)} style={{
          fontSize: 16, width: 24, height: 24, borderRadius: theme.radius.sm,
          border: `1px solid ${theme.border}`, color: theme.textTertiary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{showForm ? '−' : '+'}</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 12 }}>
          <DeadlineForm projects={projects} deadline={editingDeadline} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingDeadline(null); }} />
        </div>
      )}

      {(!deadlines || deadlines.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '16px 0', color: theme.textTertiary, fontSize: theme.font.bodySmall }}>
          No upcoming deadlines
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(grouped).map(([projId, dls]) => {
            const proj = (projects || []).find(p => p.id === projId);
            return (
              <div key={projId}>
                <div style={{
                  fontSize: theme.font.label, color: theme.textTertiary, fontWeight: 500,
                  marginBottom: 6, marginTop: 4,
                }}>{proj?.name || 'Project'}</div>
                {dls.map(dl => (
                  <DeadlineItem key={dl.id} deadline={dl} tasks={tasks || []} onDelete={onDelete} onEdit={handleEdit} />
                ))}
              </div>
            );
          })}
          {noProject.map(dl => (
            <DeadlineItem key={dl.id} deadline={dl} tasks={tasks || []} onDelete={onDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <div style={{
      padding: 14, borderRadius: theme.radius.md, border: `0.5px solid ${theme.border}`,
      background: theme.bgSecondary,
    }}>
      {content}
    </div>
  );
}
