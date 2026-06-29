import { useState, useRef, useCallback, useEffect } from 'react';

const useSpeechToText = ({ language = 'en-US', continuous = true } = {}) => {
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const finalRef = useRef('');
  const isStoppingRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    setError('');
    isStoppingRef.current = false;

    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          finalRef.current += result[0].transcript + ' ';
          setTranscript(finalRef.current.trim());
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setInterimText(interimTranscript);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
        setIsListening(false);
        return;
      }

      if (event.error === 'no-speech') return;
      if (event.error === 'aborted') return;

      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (!isStoppingRef.current) {
        try {
          recognition.start();
        } catch {}
      } else {
        setIsListening(false);
        setInterimText('');
      }
    };

    recognition.start();
  }, [language, continuous]);

  const stopListening = useCallback(() => {
    isStoppingRef.current = true;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
    setInterimText('');
  }, []);

  const resetTranscript = useCallback(() => {
    finalRef.current = '';
    setTranscript('');
    setInterimText('');
  }, []);

  useEffect(() => {
    return () => {
      isStoppingRef.current = true;

      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    transcript,
    interimText,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    displayText: transcript + (interimText ? ' ' + interimText : ''),
  };
};

export default useSpeechToText;