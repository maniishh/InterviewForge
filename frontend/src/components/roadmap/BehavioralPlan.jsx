import { Users } from 'lucide-react';

const BehavioralPlan = ({ plan, mockSchedule }) => {
  if (!plan?.topics?.length) return null;

  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid rgba(255,181,71,0.2)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'rgba(255,181,71,0.1)',
            border: '1px solid rgba(255,181,71,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={15} color="#FFB547" />
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#F0EFF8' }}>
            Behavioral Plan
          </h3>
          <p style={{ fontSize: '11px', color: '#6B6A7D' }}>
            Prepare {plan.starStories || 8} STAR stories · {plan.practiceFrequency}
          </p>
        </div>
      </div>

      {plan.focus && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            marginBottom: '14px',
            background: 'rgba(255,181,71,0.05)',
            border: '1px solid rgba(255,181,71,0.1)',
            fontSize: '12px',
            color: '#F0EFF8',
            lineHeight: 1.5,
          }}
        >
          {plan.focus}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {(plan.topics || []).map(topic => (
          <span
            key={topic}
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255,181,71,0.08)',
              border: '1px solid rgba(255,181,71,0.15)',
              color: '#FFB547',
              fontWeight: '500',
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      {mockSchedule && (
        <div
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(108,99,255,0.05)',
            border: '1px solid rgba(108,99,255,0.15)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: '#6C63FF',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            Mock Interview Schedule
          </p>

          <p style={{ fontSize: '12px', color: '#F0EFF8', marginBottom: '2px' }}>
            Starts week {mockSchedule.startingWeek} · {mockSchedule.frequency}
          </p>

          {mockSchedule.focus && (
            <p style={{ fontSize: '11px', color: '#6B6A7D' }}>{mockSchedule.focus}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BehavioralPlan;