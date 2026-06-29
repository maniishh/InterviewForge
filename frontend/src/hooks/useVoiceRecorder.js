import { useState, useRef, useCallback, useEffect } from 'react';

const useVoiceRecorder = () => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [permError, setPermError] = useState('');

  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const isActiveRef = useRef(false);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      streamRef.current = stream;
      setHasPermission(true);
      setPermError('');

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      return true;
    } catch (err) {
      setHasPermission(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermError('Microphone permission denied. Please allow access in browser settings.');
      } else {
        setPermError(`Microphone error: ${err.message}`);
      }

      return false;
    }
  }, []);

  const startMonitoring = useCallback(() => {
    if (!analyserRef.current) return;

    isActiveRef.current = true;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const tick = () => {
      if (!isActiveRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      const rms = Math.sqrt(
        dataArray.reduce((sum, val) => sum + val * val, 0) / dataArray.length
      );

      setAudioLevel(Math.min(100, Math.round((rms / 128) * 100)));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopMonitoring = useCallback(() => {
    isActiveRef.current = false;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setAudioLevel(0);
  }, []);

  const releaseMic = useCallback(() => {
    stopMonitoring();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, [stopMonitoring]);

  useEffect(() => () => releaseMic(), [releaseMic]);

  return {
    audioLevel,
    hasPermission,
    permError,
    requestPermission,
    startMonitoring,
    stopMonitoring,
    releaseMic,
  };
};

export default useVoiceRecorder;