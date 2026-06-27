// frontend/src/components/analytics/TopicAnalysis.jsx
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TrendIcon = ({ trend }) => {
  if (trend === 'improving') return <TrendingUp size={12} color="#00D9A3" />;
  if (trend === 'declining') return <TrendingDown size={12} color="#FF5757" />;
  return <Minus size={12} color="#6B6A7D" />;
};

const TopicBar = ({ topic, avgScore, attempts, trend, type }) => {
  const color = type === 'strong' ? '#00D9A3'
              : type === 'weak' ? '#FF5757'
              : '#6C63FF';

  const pct = Math.round((avgScore / 10) * 100);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendIcon trend={trend} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#F0EFF8' }}>
            {topic}
          </span>
          <span style={{ fontSize: '11px', color: '#6B6A7D' }}>
            ×{attempts}
          </span>
        </div>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          fontFamily: 'JetBrains Mono, monospace',
          color,
        }}>
          {avgScore.toFixed(1)}
        </span>
      </div>

      <div style={{
        height: '6px',
        background: '#1E1E2E',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '3px',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    color: '#6B6A7D',
    fontSize: '13px',
    fontStyle: 'italic',
  }}>
    {message}
  </div>
);

const TopicAnalysis = ({ topics }) => {
  const { weak = [], strong = [], developing = [] } = topics || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{
        background: '#111118',
        border: '1px solid rgba(255,87,87,0.2)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'rgba(255,87,87,0.1)',
            border: '1px solid rgba(255,87,87,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle size={14} color="#FF5757" />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#F0EFF8' }}>
              Focus Areas
            </h3>
            <p style={{ fontSize: '11px', color: '#6B6A7D' }}>
              Topics scoring below 5.5 · practise these
            </p>
          </div>
          {weak.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'monospace',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(255,87,87,0.1)',
              border: '1px solid rgba(255,87,87,0.2)',
              color: '#FF5757',
            }}>
              {weak.length}
            </span>
          )}
        </div>

        {weak.length === 0 ? (
          <EmptyState message="No weak topics yet — keep going!" />
        ) : (
          weak.map(t => (
            <TopicBar key={t.topic} {...t} type="weak" />
          ))
        )}

        {developing.length > 0 && (
          <>
            <div style={{
              height: '1px',
              background: '#1E1E2E',
              margin: '16px 0',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute',
                top: '-9px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#111118',
                padding: '0 8px',
                fontSize: '10px',
                color: '#3D3C52',
              }}>
                developing
              </span>
            </div>
            {developing.slice(0, 3).map(t => (
              <TopicBar key={t.topic} {...t} type="developing" />
            ))}
          </>
        )}
      </div>

      <div style={{
        background: '#111118',
        border: '1px solid rgba(0,217,163,0.2)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'rgba(0,217,163,0.1)',
            border: '1px solid rgba(0,217,163,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle2 size={14} color="#00D9A3" />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#F0EFF8' }}>
              Strong Areas
            </h3>
            <p style={{ fontSize: '11px', color: '#6B6A7D' }}>
              Topics scoring 7.0+ · maintain these
            </p>
          </div>
          {strong.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'monospace',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(0,217,163,0.1)',
              border: '1px solid rgba(0,217,163,0.2)',
              color: '#00D9A3',
            }}>
              {strong.length}
            </span>
          )}
        </div>

        {strong.length === 0 ? (
          <EmptyState message="Score 7+ on a topic to see it here" />
        ) : (
          strong.map(t => (
            <TopicBar key={t.topic} {...t} type="strong" />
          ))
        )}
      </div>
    </div>
  );
};

export default TopicAnalysis;