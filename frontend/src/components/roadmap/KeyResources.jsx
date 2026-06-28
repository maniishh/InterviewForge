import { ExternalLink, BookOpen, Video, Globe, GraduationCap } from 'lucide-react';

const TYPE_ICONS = {
  book: BookOpen,
  video: Video,
  platform: Globe,
  course: GraduationCap,
};

const PRIORITY_STYLE = {
  'must-have': { color: '#FF5757', label: 'Must-have', bg: 'rgba(255,87,87,0.1)' },
  recommended: { color: '#FFB547', label: 'Recommended', bg: 'rgba(255,181,71,0.1)' },
  optional: { color: '#6B6A7D', label: 'Optional', bg: 'rgba(107,106,125,0.1)' },
};

const KeyResources = ({ resources = [] }) => {
  if (!resources.length) return null;

  const mustHave = resources.filter(r => r.priority === 'must-have');
  const recommended = resources.filter(r => r.priority === 'recommended');
  const optional = resources.filter(r => r.priority === 'optional');

  const ResourceCard = ({ resource }) => {
    const Icon = TYPE_ICONS[resource.type] || Globe;
    const priority = PRIORITY_STYLE[resource.priority] || PRIORITY_STYLE.optional;

    return (
      <div
        style={{
          background: '#0A0A0F',
          border: '1px solid #1E1E2E',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: resource.url ? 'pointer' : 'default',
          transition: 'border-color 0.2s',
        }}
        onClick={() => resource.url && window.open(resource.url, '_blank')}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#6C63FF')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E1E2E')}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            flexShrink: 0,
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={15} color="#6C63FF" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '2px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F0EFF8' }}>
              {resource.name}
            </span>

            {resource.url && <ExternalLink size={11} color="#6B6A7D" />}

            <span
              style={{
                marginLeft: 'auto',
                fontSize: '10px',
                fontWeight: '600',
                padding: '1px 7px',
                borderRadius: '999px',
                background: priority.bg,
                color: priority.color,
              }}
            >
              {priority.label}
            </span>
          </div>

          {resource.reason && (
            <p style={{ fontSize: '11px', color: '#6B6A7D', lineHeight: 1.5 }}>
              {resource.reason}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#F0EFF8',
          marginBottom: '4px',
        }}
      >
        Key Resources
      </h3>

      <p style={{ fontSize: '12px', color: '#6B6A7D', marginBottom: '20px' }}>
        Curated specifically for your learning gaps
      </p>

      {mustHave.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              fontSize: '10px',
              color: '#FF5757',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            ● Must-Have
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mustHave.map(r => (
              <ResourceCard key={r.name} resource={r} />
            ))}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              fontSize: '10px',
              color: '#FFB547',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            ● Recommended
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommended.map(r => (
              <ResourceCard key={r.name} resource={r} />
            ))}
          </div>
        </div>
      )}

      {optional.length > 0 && (
        <div>
          <p
            style={{
              fontSize: '10px',
              color: '#6B6A7D',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            ● Optional
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {optional.map(r => (
              <ResourceCard key={r.name} resource={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyResources;