import React, { useState, useEffect } from 'react';

const Speechtotext = ({ onTranscriptChange, fromLang }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support the Web Speech API.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = fromLang || 'en-US'; // Use the language from props

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      onTranscriptChange(finalTranscript);
      setTranscript(finalTranscript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
      setIsListening(false);
    };

    const handleMicButtonClick = () => {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
      }
    };

    document.getElementById('mic-button').addEventListener('click', handleMicButtonClick);

    return () => {
      recognition.stop();
      document.getElementById('mic-button').removeEventListener('click', handleMicButtonClick);
    };
  }, [isListening, fromLang]); // Add fromLang to dependencies

  return (
    <div>
      <button id="mic-button" hidden>Microphone</button>
      {/* <p>{transcript}</p> */}
    </div>
  );
};

export default Speechtotext;
