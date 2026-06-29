const BAR_COUNT = 12;

const PHASE_OFFSETS = Array.from({ length: BAR_COUNT }, (_, i) =>
  Math.sin((i / BAR_COUNT) * Math.PI * 2) * 0.5 + 0.5
);

const VoiceWaveform = ({ audioLevel = 0, isListening = false, size = 'md' }) => {
  const heights = {
    sm: { min: 4, max: 28 },
    md: { min: 6, max: 48 },
    lg: { min: 8, max: 64 },
  };

  const { min, max } = heights[size] || heights.md;
  const containerH = max + 16;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        height: `${containerH}px`,
      }}
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const phase = PHASE_OFFSETS[i];
        const extra = isListening ? (audioLevel / 100) * (max - min) * phase : 0;
        const barHeight = Math.max(min, min + extra);

        return (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${barHeight}px`,
              borderRadius: '2px',
              transition: 'height 0.08s ease-out',
              background: isListening
                ? `rgba(108, 99, 255, ${0.4 + phase * 0.6})`
                : '#1E1E2E',
              animation: !isListening
                ? `breathe ${1.5 + i * 0.1}s ease-in-out infinite alternate`
                : 'none',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes breathe {
          from { height: ${min}px; }
          to { height: ${min + 6}px; }
        }
      `}</style>
    </div>
  );
};

export default VoiceWaveform;