const variants = {
  default: 'bg-elevated text-text-muted border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  technical: 'bg-accent/10 text-accent border-accent/20',
  behavioral: 'bg-warning/10 text-warning border-warning/20',
  'system-design': 'bg-success/10 text-success border-success/20',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1 px-2.5 py-0.5
      text-xs font-medium rounded-full border
      ${variants[variant]} ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;