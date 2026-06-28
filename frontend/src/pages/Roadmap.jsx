import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, Map, ChevronRight } from 'lucide-react';
import useRoadmap from '../hooks/useRoadmap';
import useAnalytics from '../hooks/useAnalytics';
import RoadmapProgress from '../components/roadmap/RoadmapProgress';
import WeakStrongAreas from '../components/roadmap/WeakStrongAreas';
import WeekPlan from '../components/roadmap/WeekPlan';
import KeyResources from '../components/roadmap/KeyResources';
import BehavioralPlan from '../components/roadmap/BehavioralPlan';
import Spinner from '../components/ui/Spinner';

const Skeleton = ({ h = 40, r = 12, w = '100%', style = {} }) => (
  <div
    style={{
      height: h,
      width: w,
      borderRadius: r,
      background: 'linear-gradient(90deg, #1A1A24 25%, #1E1E2E 50%, #1A1A24 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }}
  />
);

const SkeletonRoadmap = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    <Skeleton h={160} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <Skeleton h={240} />
      <Skeleton h={240} />
    </div>
    <Skeleton h={320} />
    <Skeleton h={200} />
  </div>
);

const EmptyRoadmap = ({ onGenerate, isGenerating, hasInterviews }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '480px',
      textAlign: 'center',
      background: '#111118',
      border: '1px solid #1E1E2E',
      borderRadius: '20px',
      padding: '48px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        marginBottom: '20px',
        background: 'rgba(108,99,255,0.1)',
        border: '1px solid rgba(108,99,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Map size={28} color="#6C63FF" />
    </div>

    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#F0EFF8', marginBottom: '10px' }}>
      {hasInterviews ? 'Generate Your Roadmap' : 'Complete an Interview First'}
    </h2>

    <p
      style={{
        fontSize: '14px',
        color: '#6B6A7D',
        maxWidth: '400px',
        lineHeight: 1.6,
        marginBottom: '28px',
      }}
    >
      {hasInterviews
        ? 'Based on your interview performance, our AI will create a personalised week-by-week study plan targeting your specific weak areas.'
        : 'Complete at least one interview to unlock your AI-generated personalised roadmap.'}
    </p>

    {hasInterviews ? (
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '12px',
          background: isGenerating ? 'rgba(108,99,255,0.5)' : '#6C63FF',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          border: 'none',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 24px rgba(108,99,255,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {isGenerating ? (
          <>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            AI is generating your roadmap...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate My Roadmap
            <ChevronRight size={14} />
          </>
        )}
      </button>
    ) : (
      <a
        href="/setup"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '12px',
          background: '#6C63FF',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          textDecoration: 'none',
          boxShadow: '0 0 24px rgba(108,99,255,0.25)',
        }}
      >
        Start an Interview →
      </a>
    )}

    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const Roadmap = () => {
  const navigate = useNavigate();

  const {
    roadmap,
    isLoading,
    isGenerating,
    error,
    hasRoadmap,
    progressPct,
    currentWeek,
    generateRoadmap,
    markTaskComplete,
  } = useRoadmap();

  const { overview, topics } = useAnalytics();
  const hasInterviews = (overview?.totalSessions || 0) >= 1;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '10px',
                background: 'rgba(108,99,255,0.1)',
                border: '1px solid rgba(108,99,255,0.2)',
                fontSize: '11px',
                fontWeight: '500',
                color: '#6C63FF',
              }}
            >
              <Map size={11} />
              Learning Roadmap
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#F0EFF8', marginBottom: '4px' }}>
              Your Study Plan
            </h1>

            <p style={{ fontSize: '14px', color: '#6B6A7D' }}>
              {hasRoadmap
                ? `Week ${currentWeek} · ${progressPct}% complete`
                : 'AI-personalised based on your interview performance'}
            </p>
          </div>

          {hasRoadmap && (
            <button onClick={generateRoadmap} disabled={isGenerating}>
              {isGenerating ? <><Spinner size="sm" /> Regenerating...</> : <><RefreshCw size={13} /> Regenerate</>}
            </button>
          )}
        </div>

        {isLoading && <SkeletonRoadmap />}

        {!isLoading && error && <div>⚠ {error}</div>}

        {!isLoading && !error && !hasRoadmap && (
          <EmptyRoadmap
            onGenerate={generateRoadmap}
            isGenerating={isGenerating}
            hasInterviews={hasInterviews}
          />
        )}

        {!isLoading && !error && hasRoadmap && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <RoadmapProgress roadmap={roadmap} />
            <WeakStrongAreas roadmap={roadmap} topics={topics} />
            <WeekPlan
              roadmap={roadmap}
              onTaskComplete={markTaskComplete}
              currentWeek={currentWeek}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <KeyResources resources={roadmap.keyResources} />
              <BehavioralPlan
                plan={roadmap.behavioralPlan}
                mockSchedule={roadmap.mockInterviewSchedule}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;