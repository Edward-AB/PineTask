import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { dateKey } from '../../utils/dates.js';
import { slotToTime, timeToSlot } from '../../utils/slots.js';
import { SLOTS_PER_HOUR } from '../../constants';

const TOTAL_SLOTS = 24 * SLOTS_PER_HOUR;
const DEFAULT_COLOR = '#6366f1';

const COLOR_OPTIONS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#14b8a6', label: 'Teal' },
];

/** Build time options in 15-min increments: ["00:00", "00:15", ...] */
function buildTimeOptions() {
  const opts = [];
  for (let s = 0; s < TOTAL_SLOTS; s++) {
    opts.push(slotToTime(s));
  }
  return opts;
}

const TIME_OPTIONS = buildTimeOptions();

export default function EventForm({ event, onSubmit, onCancel }) {
  const { theme } = useTheme();

  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || dateKey(new Date()));
  const [startTime, setStartTime] = useState(
    event?.start_slot != null ? slotToTime(event.start_slot) : '09:00'
  );
  const [endTime, setEndTime] = useState(
    event?.end_slot != null ? slotToTime(event.end_slot) : '10:00'
  );
  const [description, setDescription] = useState(event?.description || '');
  const [color, setColor] = useState(event?.color || DEFAULT_COLOR);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDate(event.date || dateKey(new Date()));
      setStartTime(event.start_slot != null ? slotToTime(event.start_slot) : '09:00');
      setEndTime(event.end_slot != null ? slotToTime(event.end_slot) : '10:00');
      setDescription(event.description || '');
      setColor(event.color || DEFAULT_COLOR);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const startSlot = timeToSlot(startTime);
    const endSlot = timeToSlot(endTime);

    if (endSlot <= startSlot) {
      setError('End time must be after start time');
      return;
    }

    onSubmit({
      ...(event?.id ? { id: event.id } : {}),
      title: title.trim(),
      date,
      start_slot: startSlot,
      end_slot: endSlot,
      description: description.trim() || null,
      color,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.border}`,
    background: theme.bg,
    color: theme.textPrimary,
    fontSize: theme.font.body,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    padding: '5px 8px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.border}`,
    background: theme.bg,
    color: theme.textSecondary,
    fontSize: theme.font.label,
  };

  const labelStyle = {
    fontSize: theme.font.label,
    color: theme.textSecondary,
    fontWeight: 500,
    marginBottom: 4,
    display: 'block',
  };

  return (
    <div style={{
      padding: 16,
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.border}`,
      background: theme.surface,
    }}>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title..."
            style={inputStyle}
            autoFocus
          />
        </div>

        {/* Date */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...inputStyle, width: 'auto' }}
          />
        </div>

        {/* Start / End time */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
          <div>
            <label style={labelStyle}>Start</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={selectStyle}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={`s-${t}`} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>End</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={selectStyle}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={`e-${t}`} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Color</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {COLOR_OPTIONS.map((c) => {
              const active = color === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: theme.radius.full,
                    background: c.value,
                    border: active ? '2px solid #fff' : '2px solid transparent',
                    boxShadow: active ? `0 0 0 2px ${c.value}` : 'none',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    transition: `box-shadow ${theme.transition}`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontSize: theme.font.label,
            color: theme.danger,
            marginBottom: 8,
          }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '6px 16px',
                borderRadius: theme.radius.md,
                background: 'transparent',
                color: theme.textSecondary,
                fontWeight: 500,
                fontSize: theme.font.bodySmall,
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            style={{
              padding: '6px 16px',
              borderRadius: theme.radius.md,
              background: theme.accentBtn,
              color: theme.accentBtnText,
              fontWeight: 500,
              fontSize: theme.font.bodySmall,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {event?.id ? 'Update event' : 'Add event'}
          </button>
        </div>
      </form>
    </div>
  );
}
