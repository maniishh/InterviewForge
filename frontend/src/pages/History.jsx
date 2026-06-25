// src/pages/History.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Building2, Trophy, ChevronRight,
  BarChart3, Calendar, Zap, Search
} from 'lucide-react';
import api from '../api/axiosInstance';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ScoreRing from '../components/ui/ScoreRing';

const StatCard = ({ icon: Icon, label, value, sub, color = '#6C63FF' }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-text-muted mb-1">{label}</p>
        <p className="text-3xl font-bold font-mono" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      </div>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
           style={{ background: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
  </Card>
);

const SessionCard = ({ session, onClick }) => {
  const score = session.overallScore;
  const color = score >= 7 ? '#00D9A3' : score >= 5 ? '#6C63FF' : '#FF5757';
  const date  = new Date(session.completedAt || session.createdAt);

  return (
    <Card
      className="p-5 cursor-pointer hover:border-accent/30
                 transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">

        {/* Score ring */}
        <div className="flex-shrink-0">
          <ScoreRing score={score || 0} size={64} strokeWidth={5} showLabel={false} animate={false} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary truncate">
              {session.company}
            </span>
            <Badge variant={
              session.difficulty === 'hard'   ? 'warning' :
              session.difficulty === 'medium' ? 'accent'  : 'success'
            }>
              {session.difficulty}
            </Badge>
          </div>

          <p className="text-sm text-text-muted truncate">{session.jobRole}</p>

          <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Zap size={11} />
              {session.questions?.length || 0} questions
            </span>
          </div>
        </div>

        {/* Dimension scores */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          {[
            { label: 'Tech', val: session.avgTechnicalScore },
            { label: 'Comm', val: session.avgCommunicationScore },
            { label: 'Depth', val: session.avgDepthScore },
          ].map(({ label, val }) => val != null && (
            <div key={label} className="text-center">
              <p className="text-xs font-mono font-bold" style={{ color }}>
                {val?.toFixed(1)}
              </p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>

        <ChevronRight size={16}
          className="text-text-subtle group-hover:text-accent
                     transition-colors duration-200 flex-shrink-0" />
      </div>
    </Card>
  );
};

const History = () => {
  const navigate = useNavigate();

  const [sessions,   setSessions]   = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/history');
        setSessions(data.data.sessions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = sessions.filter(s => {
    const matchSearch =
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.jobRole.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.difficulty === filter;
    return matchSearch && matchFilter;
  });

  /* Stats */
  const totalSessions = sessions.length;
  const avgScore = sessions.length
    ? (sessions.reduce((s, x) => s + (x.overallScore || 0), 0) / sessions.length).toFixed(1)
    : '—';
  const bestScore = sessions.length
    ? Math.max(...sessions.map(s => s.overallScore || 0)).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-base pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8 animate-slide-up">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Interview History</h1>
          <p className="text-text-muted mt-1">Track your progress over time</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Total Sessions" value={totalSessions}
                    sub="completed interviews" color="#6C63FF" />
          <StatCard icon={Trophy}   label="Average Score"  value={avgScore}
                    sub="across all sessions"  color="#00D9A3" />
          <StatCard icon={Zap}      label="Best Score"     value={bestScore}
                    sub="personal best"         color="#FFB547" />
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="input-base pl-10"
              placeholder="Search by company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border
                            capitalize transition-all duration-200
                            ${filter === f
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'border-border text-text-muted hover:border-accent/40'
                            }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Session list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner size="lg" />
            <p className="text-text-muted text-sm">Loading your sessions...</p>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-danger mb-4">⚠ {error}</p>
            <Button onClick={() => window.location.reload()} variant="secondary">
              Try again
            </Button>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20
                            flex items-center justify-center mx-auto mb-4">
              <Clock size={20} className="text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              {sessions.length === 0 ? 'No interviews yet' : 'No results found'}
            </h3>
            <p className="text-text-muted text-sm mb-6">
              {sessions.length === 0
                ? 'Complete your first mock interview to see it here'
                : 'Try adjusting your search or filter'}
            </p>
            {sessions.length === 0 && (
              <Button onClick={() => navigate('/setup')}>
                Start your first interview
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(session => (
              <SessionCard
                key={session._id || session.id}
                session={session}
                onClick={() => navigate('/feedback', {
                  state: {
                    result: {
                      session,
                      overallScore:          session.overallScore,
                      avgTechnicalScore:     session.avgTechnicalScore,
                      avgCommunicationScore: session.avgCommunicationScore,
                      avgDepthScore:         session.avgDepthScore,
                      performance:           session.performance,
                      durationMinutes:       session.durationMinutes,
                      totalQuestions:        session.questions?.length,
                      answeredQuestions:     session.answers?.length,
                    }
                  }
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;