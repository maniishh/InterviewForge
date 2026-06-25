// src/pages/Feedback.jsx
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Trophy, RotateCcw, History, ChevronDown, ChevronUp,
  CheckCircle2, Lightbulb, AlertCircle, Star
} from 'lucide-react';
import { useState } from 'react';
import ScoreRing from '../components/ui/ScoreRing';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const PERFORMANCE_CONFIG = {
  Outstanding: { color: '#00D9A3', bg: 'bg-success/10', border: 'border-success/20' },
  Strong:      { color: '#6C63FF', bg: 'bg-accent/10',  border: 'border-accent/20'  },
  Developing:  { color: '#FFB547', bg: 'bg-warning/10', border: 'border-warning/20' },
  'Needs Work':{ color: '#FF5757', bg: 'bg-danger/10',  border: 'border-danger/20'  },
  Beginning:   { color: '#FF5757', bg: 'bg-danger/10',  border: 'border-danger/20'  },
};

const QuestionAccordion = ({ question, answer, evaluation, index }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-border rounded-2xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between p-5
                   bg-surface hover:bg-elevated transition-colors duration-200"
      >
        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20
                          flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-mono text-xs font-bold">Q{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {question.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={question.type}>{question.type}</Badge>
              <span className="text-xs text-text-muted">{question.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          {evaluation && (
            <span className="font-mono font-bold text-sm"
                  style={{
                    color: evaluation.overallScore >= 7 ? '#00D9A3'
                         : evaluation.overallScore >= 5 ? '#6C63FF'
                         : '#FF5757'
                  }}>
              {evaluation.overallScore?.toFixed(1)}/10
            </span>
          )}
          {open
            ? <ChevronUp size={16} className="text-text-muted" />
            : <ChevronDown size={16} className="text-text-muted" />
          }
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-base/50 p-5 space-y-5 animate-fade-in">

          {/* Answer */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Your Answer
            </p>
            <p className="text-sm text-text-primary leading-relaxed bg-elevated
                          rounded-xl px-4 py-3 border border-border">
              {answer?.text || <span className="text-text-muted italic">No answer provided</span>}
            </p>
          </div>

          {/* Scores */}
          {evaluation && (
            <>
              <div className="grid grid-cols-4 gap-3">
                <ScoreRing score={evaluation.technicalScore     || 0} size={80} label="Technical" />
                <ScoreRing score={evaluation.communicationScore || 0} size={80} label="Communication" />
                <ScoreRing score={evaluation.depthScore         || 0} size={80} label="Depth" />
                <ScoreRing score={evaluation.overallScore       || 0} size={80} label="Overall" />
              </div>

              <div className="space-y-3">
                {[
                  { icon: AlertCircle,  label: 'Feedback',     color: '#6C63FF', text: evaluation.feedback },
                  { icon: CheckCircle2, label: 'Strengths',    color: '#00D9A3', text: evaluation.strengths },
                  { icon: Lightbulb,    label: 'Improvements', color: '#FFB547', text: evaluation.improvements },
                ].map(({ icon: Icon, label, color, text }) => text && (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={14} style={{ color }} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider mr-2"
                            style={{ color }}>{label}:</span>
                      <span className="text-xs text-text-muted leading-relaxed">{text}</span>
                    </div>
                  </div>
                ))}

                {evaluation.suggestedAnswer && (
                  <div className="p-3 rounded-xl bg-elevated border border-border">
                    <p className="text-xs font-semibold text-text-muted mb-1">
                      💡 Ideal Answer
                    </p>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {evaluation.suggestedAnswer}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result   = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">No feedback data found.</p>
        <Button onClick={() => navigate('/setup')}>Start New Interview</Button>
      </div>
    );
  }

  const {
    session, overallScore, avgTechnicalScore,
    avgCommunicationScore, avgDepthScore,
    performance, durationMinutes, totalQuestions, answeredQuestions,
  } = result;

  const perfConfig = PERFORMANCE_CONFIG[performance?.label] || PERFORMANCE_CONFIG.Developing;

  return (
    <div className="min-h-screen bg-base pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8">

        {/* ── HERO ── */}
        <div className="text-center mb-10 animate-slide-up gradient-mesh
                        rounded-3xl p-10 border border-border">
          <div className="flex justify-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                            border text-sm font-semibold
                            ${perfConfig.bg} ${perfConfig.border}`}
                 style={{ color: perfConfig.color }}>
              <Trophy size={16} />
              {performance?.label || 'Completed'}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Interview Complete!
          </h1>
          <p className="text-text-muted mb-8">
            {session?.company} · {session?.jobRole} · {session?.difficulty}
          </p>

          {/* Main score ring */}
          <div className="flex justify-center mb-8">
            <ScoreRing
              score={overallScore || 0}
              size={160}
              strokeWidth={12}
              label="Overall Score"
              showLabel
            />
          </div>

          {/* 3 dimension scores */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <ScoreRing score={avgTechnicalScore     || 0} size={100} label="Technical"     />
            <ScoreRing score={avgCommunicationScore || 0} size={100} label="Communication" />
            <ScoreRing score={avgDepthScore         || 0} size={100} label="Depth"         />
          </div>

          {/* Session meta */}
          <div className="flex items-center justify-center gap-6 mt-8
                          pt-8 border-t border-border text-sm text-text-muted">
            <div>
              <span className="font-mono font-bold text-text-primary">
                {answeredQuestions}
              </span>/{totalQuestions} questions answered
            </div>
            {durationMinutes && (
              <div>
                <span className="font-mono font-bold text-text-primary">
                  {durationMinutes}
                </span> minutes
              </div>
            )}
          </div>
        </div>

        {/* ── SCORE BREAKDOWN CARDS ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Technical Accuracy', score: avgTechnicalScore,     desc: 'Correctness & algorithms' },
            { label: 'Communication',      score: avgCommunicationScore, desc: 'Clarity & structure' },
            { label: 'Depth of Knowledge', score: avgDepthScore,         desc: 'Edge cases & trade-offs' },
          ].map(({ label, score, desc }) => {
            const color = score >= 7 ? '#00D9A3' : score >= 5 ? '#6C63FF' : '#FF5757';
            return (
              <Card key={label} className="p-5 text-center">
                <p className="text-xs text-text-muted mb-1">{desc}</p>
                <p className="text-3xl font-bold font-mono mt-2"
                   style={{ color }}>
                  {score?.toFixed(1)}
                </p>
                <p className="text-xs font-semibold text-text-muted mt-1">{label}</p>
              </Card>
            );
          })}
        </div>

        {/* ── PER QUESTION BREAKDOWN ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-accent" />
            <h2 className="font-bold text-text-primary">Question Breakdown</h2>
          </div>
          <div className="space-y-3">
            {(session?.questions || []).map((q, i) => (
              <QuestionAccordion
                key={i}
                index={i}
                question={q}
                answer={session?.answers?.find(a => a.questionIndex === i)}
                evaluation={session?.evaluations?.find(e => e.questionIndex === i)}
              />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/setup')}
            className="flex-1"
            leftIcon={<RotateCcw size={16} />}
          >
            Start New Interview
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            leftIcon={<History size={16} />}
            onClick={() => navigate('/history')}
          >
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;