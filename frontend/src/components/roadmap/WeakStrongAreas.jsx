import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AreaCard = ({ topic, score, trend, type }) => {
  const colors = {
    weak: { text: '#FF5757', bg: 'rgba(255,87,87,0.08)', border: 'rgba(255,87,87,0.2)' },
    strong: { text: '#00D9A3', bg: 'rgba(0,217,163,0.08)', border: 'rgba(0,217,163,0.2)' },
    developing: { text: '#6C63FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)' },
  };

  const c = colors[type] || colors.developing;
  const pct = Math.round(((score || 0) / 10) * 100);

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#F0EFF8' }}>
          {topic}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend === 'improving' && <TrendingUp size={11} color="#00D9A3" />}
          {trend === 'declining' && <TrendingDown size={11} color="#FF5757" />}
          {(!trend || trend === 'stable') && <Minus size={11} color="#6B6A7D" />}

          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'monospace',
              color: c.text,
            }}
          >
            {score?.toFixed(1) || '—'}/10
          </span>
        </div>
      </div>

      <div
        style={{
          height: '4px',
          background: '#1E1E2E',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            width: `${pct}%`,
            background: c.text,
            transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </div>
    </div>
  );
};

const WeakStrongAreas = ({ roadmap, topics }) => {
  const weakTopics = topics?.weak || [];
  const strongTopics = topics?.strong || [];
  const devTopics = topics?.developing || [];

  const snapshotWeak = roadmap?.analyticsSnapshot?.weakTopics || [];
  const snapshotStrong = roadmap?.analyticsSnapshot?.strongTopics || [];

  const displayWeak = weakTopics.length
    ? weakTopics
    : snapshotWeak.map(t => ({ topic: t, avgScore: 0 }));

  const displayStrong = strongTopics.length
    ? strongTopics
    : snapshotStrong.map(t => ({ topic: t, avgScore: 8 }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,87,87,0.2)',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(255,87,87,0.1)',
              border: '1px solid rgba(255,87,87,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={14} color="#FF5757" />
          </div>

          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#F0EFF8' }}>Focus Areas</p>
            <p style={{ fontSize: '11px', color: '#6B6A7D' }}>Prioritised in your roadmap</p>
          </div>

          {displayWeak.length > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(255,87,87,0.1)',
                border: '1px solid rgba(255,87,87,0.2)',
                color: '#FF5757',
              }}
            >
              {displayWeak.length}
            </span>
          )}
        </div>

        {displayWeak.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#6B6A7D', fontStyle: 'italic' }}>
            No weak areas identified — great start!
          </p>
        ) : (
          displayWeak.map(t => (
            <AreaCard key={t.topic} topic={t.topic} score={t.avgScore} trend={t.trend} type="weak" />
          ))
        )}

        {devTopics.length > 0 && (
          <>
            <div style={{ height: '1px', background: '#1E1E2E', margin: '12px 0' }} />
            <p
              style={{
                fontSize: '10px',
                color: '#3D3C52',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Developing
            </p>

            {devTopics.slice(0, 3).map(t => (
              <AreaCard
                key={t.topic}
                topic={t.topic}
                score={t.avgScore}
                trend={t.trend}
                type="developing"
              />
            ))}
          </>
        )}
      </div>

      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(0,217,163,0.2)',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(0,217,163,0.1)',
              border: '1px solid rgba(0,217,163,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={14} color="#00D9A3" />
          </div>

          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#F0EFF8' }}>Strong Areas</p>
            <p style={{ fontSize: '11px', color: '#6B6A7D' }}>Keep practising these</p>
          </div>

          {displayStrong.length > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(0,217,163,0.1)',
                border: '1px solid rgba(0,217,163,0.2)',
                color: '#00D9A3',
              }}
            >
              {displayStrong.length}
            </span>
          )}
        </div>

        {displayStrong.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#6B6A7D', fontStyle: 'italic' }}>
            Complete more interviews to identify strong areas
          </p>
        ) : (
          displayStrong.map(t => (
            <AreaCard key={t.topic} topic={t.topic} score={t.avgScore} trend={t.trend} type="strong" />
          ))
        )}
      </div>
    </div>
  );
};

export default WeakStrongAreas;