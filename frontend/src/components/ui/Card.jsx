const Card = ({
  children,
  className = '',
  elevated = false,
  gradient = false,
  ...props
}) => (
  <div
    className={`
      ${elevated ? 'card-elevated' : 'card'}
      ${gradient ? 'border-gradient' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export default Card;