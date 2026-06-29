 
const VoiceBrowserWarning = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
  const isEdge   = /Edg/.test(navigator.userAgent);

  if (isChrome || isEdge) return null;

  return (
    <div style={{
      padding: '10px 16px', borderRadius: '10px', marginBottom: '12px',
      background: 'rgba(255,181,71,0.08)', border: '1px solid rgba(255,181,71,0.2)',
      fontSize: '12px', color: '#FFB547', lineHeight: 1.5,
    }}>
      <strong>Voice mode works best in Chrome or Edge.</strong>{' '}
      Your browser has limited speech recognition support — use text mode for best results.
    </div>
  );
};

export default VoiceBrowserWarning;