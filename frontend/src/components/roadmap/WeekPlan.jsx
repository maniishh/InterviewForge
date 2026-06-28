import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Zap,
} from 'lucide-react';

const CATEGORY_STYLE = {
  technical: { color: '#6C63FF', bg: 'rgba(108,99,255,0.1)', label: 'Technical' },
  behavioral: { color: '#FFB547', bg: 'rgba(255,181,71,0.1)', label: 'Behavioral' },
  'system-design': { color: '#00D9A3', bg: 'rgba(0,217,163,0.1)', label: 'System Design' },
  practice: { color: '#00A87E', bg: 'rgba(0,168,126,0.1)', label: 'Practice' },
};

const DIFFICULTY_STYLE = {
  easy: { color: '#00D9A3', label: 'Easy' },
  medium: { color: '#FFB547', label: 'Medium' },
  hard: { color: '#FF5757', label: 'Hard' },
};

const TaskRow = ({ task, onComplete, roadmapId, week }) => {
  const cat = CATEGORY_STYLE[task.category] || CATEGORY_STYLE.practice;
  const diff = DIFFICULTY_STYLE[task.difficulty] || DIFFICULTY_STYLE.medium;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #1E1E2E',
        opacity: task.completed ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <button
        onClick={() => !task.completed && onComplete(roadmapId, week, task.day)}
        style={{
          background: 'none',
          border: 'none',
          cursor: task.completed ? 'default' : 'pointer',
          padding: '2px',
          flexShrink: 0,
          marginTop: '1px',
          color: task.completed ? '#00D9A3' : '#3D3C52',
          transition: 'color 0.2s',
        }}
      >
        {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#6B6A7D',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {task.day}
          </span>

          <span
            style={{
              fontSize: '10px',
              fontWeight: '500',
              padding: '1px 7px',
              borderRadius: '999px',
              background: cat.bg,
              color: cat.color,
            }}
          >
            {cat.label}
          </span>

          <span style={{ fontSize: '10px', color: diff.color, fontWeight: '600' }}>
            ● {diff.label}
          </span>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: task.completed ? '#6B6A7D' : '#F0EFF8',
            textDecoration: task.completed ? 'line-through' : 'none',
            lineHeight: 1.4,
            marginBottom: '4px',
          }}
        >
          {task.task}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#6B6A7D',
            }}
          >
            <Clock size={10} />
            {task.duration}
          </span>

          {task.resource && (
            <span
              style={{
                fontSize: '11px',
                color: '#6C63FF',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <ExternalLink size={10} />
              {task.resource.length > 50
                ? task.resource.substring(0, 50) + '...'
                : task.resource}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const WeekCard = ({ week, isCurrentWeek, onTaskComplete, roadmapId }) => {
  const [open, setOpen] = useState(isCurrentWeek);

  const completedTasks = week.dailyTasks?.filter(t => t.completed)?.length || 0;
  const totalTasks = week.dailyTasks?.length || 0;
  const weekPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isComplete = weekPct === 100;

  return (
    <div
      style={{
        background: '#111118',
        border: `1px solid ${
          isCurrentWeek
            ? 'rgba(108,99,255,0.4)'
            : isComplete
            ? 'rgba(0,217,163,0.3)'
            : '#1E1E2E'
        }`,
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            flexShrink: 0,
            background: isCurrentWeek
              ? 'rgba(108,99,255,0.15)'
              : isComplete
              ? 'rgba(0,217,163,0.15)'
              : '#1A1A24',
            border: `1px solid ${
              isCurrentWeek
                ? 'rgba(108,99,255,0.3)'
                : isComplete
                ? 'rgba(0,217,163,0.3)'
                : '#1E1E2E'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'monospace',
            color: isCurrentWeek ? '#6C63FF' : isComplete ? '#00D9A3' : '#6B6A7D',
          }}
        >
          W{week.week}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#F0EFF8' }}>
              {week.theme}
            </span>

            {isCurrentWeek && (
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(108,99,255,0.15)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  color: '#6C63FF',
                  fontWeight: '600',
                }}
              >
                Current
              </span>
            )}

            {isComplete && <CheckCircle2 size={14} color="#00D9A3" />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <div
              style={{
                flex: 1,
                height: '3px',
                background: '#1E1E2E',
                borderRadius: '2px',
                overflow: 'hidden',
                maxWidth: '120px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  width: `${weekPct}%`,
                  background: isComplete ? '#00D9A3' : '#6C63FF',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>

            <span style={{ fontSize: '11px', color: '#6B6A7D', fontFamily: 'monospace' }}>
              {completedTasks}/{totalTasks}
            </span>
          </div>
        </div>

        {open ? <ChevronUp size={16} color="#6B6A7D" /> : <ChevronDown size={16} color="#6B6A7D" />}
      </button>

      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1E1E2E' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '12px',
              margin: '16px 0 4px',
              background: 'rgba(108,99,255,0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(108,99,255,0.1)',
            }}
          >
            <Zap size={14} color="#6C63FF" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '11px', color: '#6C63FF', fontWeight: '600', marginBottom: '2px' }}>
                Week Goal
              </p>
              <p style={{ fontSize: '12px', color: '#F0EFF8', lineHeight: 1.4 }}>{week.goal}</p>
            </div>
          </div>

          {(week.dailyTasks || []).map(task => (
            <TaskRow
              key={`${week.week}-${task.day}`}
              task={task}
              week={week.week}
              roadmapId={roadmapId}
              onComplete={onTaskComplete}
            />
          ))}

          {week.weeklyChallenge && (
            <div style={{ marginTop: '12px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#F0EFF8' }}>{week.weeklyChallenge}</p>
            </div>
          )}

          {week.successMetric && (
            <div style={{ marginTop: '8px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#F0EFF8' }}>{week.successMetric}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const WeekPlan = ({ roadmap, onTaskComplete, currentWeek }) => {
  if (!roadmap?.phases?.length) return null;

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#F0EFF8', marginBottom: '16px' }}>
        Weekly Plan
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {roadmap.phases.map(phase => (
          <div key={phase.phase}>
            <div style={{ marginBottom: '10px' }}>
              Phase {phase.phase}: {phase.title}
            </div>

            {(phase.weeks || []).map(week => (
              <div key={week.week} style={{ marginBottom: '10px' }}>
                <WeekCard
                  week={week}
                  isCurrentWeek={week.week === currentWeek}
                  onTaskComplete={onTaskComplete}
                  roadmapId={roadmap.id || roadmap._id}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekPlan;