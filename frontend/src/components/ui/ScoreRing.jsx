import { useEffect, useRef } from 'react';

const getScoreColor = (score) => {
  if (score >= 8) return '#00D9A3';
  if (score >= 6) return '#6C63FF';
  if (score >= 4) return '#FFB547';
  return '#FF5757';
};

const getScoreLabel = (score) => {
  if (score >= 9) return 'Outstanding';
  if (score >= 7) return 'Strong';
  if (score >= 5) return 'Developing';
  if (score >= 3) return 'Needs Work';
  return 'Beginning';
};

const ScoreRing = ({
  score = 0,
  size = 120,
  label,
  showLabel = true,
  strokeWidth = 8,
  animate = true,
  className = '',
}) => {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const offset = circumference - (score / 10) * circumference;

  useEffect(() => {
    if (!animate || !circleRef.current) return;

    circleRef.current.style.strokeDashoffset = circumference;

    const timer = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transition =
          'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        circleRef.current.style.strokeDashoffset = offset;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [score, circumference, offset, animate]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E1E2E"
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity={0.2}
            filter="blur(4px)"
          />

          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animate ? circumference : offset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold leading-none"
            style={{
              fontSize: size * 0.22,
              color,
            }}
          >
            {score.toFixed(1)}
          </span>

          <span
            className="text-text-muted font-mono leading-none mt-0.5"
            style={{ fontSize: size * 0.1 }}
          >
            /10
          </span>
        </div>
      </div>

      {showLabel && label && (
        <div className="text-center">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {label}
          </p>

          {score > 0 && (
            <p className="text-xs mt-0.5" style={{ color }}>
              {getScoreLabel(score)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreRing;