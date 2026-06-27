// frontend/src/components/analytics/ScoreTrendChart.jsx
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const LINES = [
  { key: 'overallScore', label: 'Overall', color: '#F0EFF8', dash: false },
  { key: 'avgTechnicalScore', label: 'Technical', color: '#6C63FF', dash: false },
  { key: 'avgCommunicationScore', label: 'Communication', color: '#00D9A3', dash: false },
  { key: 'avgDepthScore', label: 'Depth', color: '#FFB547', dash: false },
  { key: 'movingAvg', label: 'Trend (3-avg)', color: '#FF5757', dash: true },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;

  return (
    <div style={{
      background: '#1A1A24',
      border: '1px solid #1E1E2E',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '180px',
    }}>
      <p style={{ fontSize: '12px', color: '#6B6A7D', marginBottom: '8px' }}>
        Session {label} {d?.company ? `· ${d.company}` : ''}
      </p>
      {payload.map(p => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          <span style={{ fontSize: '12px', color: p.color }}>{p.name}</span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'monospace',
              color: p.color,
            }}
          >
            {p.value?.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
};

const ScoreTrendChart = ({ trends }) => {
  const [visible, setVisible] = useState({
    overallScore: true,
    avgTechnicalScore: true,
    avgCommunicationScore: true,
    avgDepthScore: false,
    movingAvg: true,
  });

  const toggle = (key) => setVisible(p => ({ ...p, [key]: !p[key] }));

  if (!trends?.length) {
    return (
      <div style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6B6A7D', fontSize: '14px' }}>
          Complete more interviews to see your score trend
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1E1E2E',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#F0EFF8' }}>
            Score Trend
          </h3>
          <p style={{ fontSize: '12px', color: '#6B6A7D', marginTop: '2px' }}>
            {trends.length} sessions · scroll to explore
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {LINES.map(l => (
            <button
              key={l.key}
              onClick={() => toggle(l.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: visible[l.key] ? `${l.color}15` : 'transparent',
                border: `1px solid ${visible[l.key] ? l.color : '#1E1E2E'}`,
                color: visible[l.key] ? l.color : '#6B6A7D',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: l.dash ? '2px' : '8px',
                  borderRadius: l.dash ? '0' : '50%',
                  background: l.color,
                  borderTop: l.dash ? `2px dashed ${l.color}` : 'none',
                }}
              />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
          <XAxis
            dataKey="sessionNumber"
            tick={{ fill: '#6B6A7D', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1E1E2E' }}
            label={{
              value: 'Session',
              position: 'insideBottom',
              offset: -2,
              fill: '#6B6A7D',
              fontSize: 11
            }}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: '#6B6A7D', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1E1E2E' }}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={7}
            stroke="#00D9A3"
            strokeDasharray="4 4"
            strokeOpacity={0.3}
            label={{ value: 'Target', fill: '#00D9A3', fontSize: 10 }}
          />

          {LINES.map(l => visible[l.key] && (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.label}
              stroke={l.color}
              strokeWidth={
                l.key === 'overallScore'
                  ? 2.5
                  : l.key === 'movingAvg'
                  ? 2
                  : 1.5
              }
              strokeDasharray={l.dash ? '5 5' : undefined}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: l.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreTrendChart;