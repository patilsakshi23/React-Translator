import React, { useState, useEffect, useRef } from "react";
import countries from "../data";
import Speechtotext from './Speechtotext';
import Imgtotext from './Imgtotext';

const Translate = () => {
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromLang, setFromLang] = useState('en-GB');
  const [toLang, setToLang] = useState('hi-IN');

  const fromTextRef = useRef(null);
  const toTextRef = useRef(null);
  const fromSelectRef = useRef(null);
  const toSelectRef = useRef(null);
  const exchangeIconRef = useRef(null);
  const translateBtnRef = useRef(null);
  const iconsRef = useRef([]);

  useEffect(() => {
    const fromSelect = fromSelectRef.current;
    const toSelect = toSelectRef.current;

    Object.entries(countries).forEach(([country_code, country_name]) => {
      const option = `<option value="${country_code}">${country_name}</option>`;
      fromSelect.insertAdjacentHTML("beforeend", option);
      toSelect.insertAdjacentHTML("beforeend", option);
    });

    fromSelect.value = fromLang;
    toSelect.value = toLang;
  }, []);

  const handleTranslate = async () => {
    const text = fromText.trim();
    if (!text) return;

    setToText('Translating...');
    const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setToText(data.responseData.translatedText || 'Translation');
    } catch (error) {
      console.error('Error fetching translation:', error);
      setToText('Error');
    }
  };

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    setFromLang(toLang);
    setToLang(fromLang);

    fromSelectRef.current.value = toLang;
    toSelectRef.current.value = fromLang;
  };

  const handleIconClick = (id) => {
    if (id === 'from') {
      navigator.clipboard.writeText(fromText);
    } else {
      navigator.clipboard.writeText(toText);
    }
  };

  const handleSpeech = (id) => {
    if (id === 'from' || id === 'to') {
      window.speechSynthesis.cancel();
    }

    const textToSpeak = id === 'from' ? fromText : toText;
    const chunkSize = 500;

    // Split text into chunks
    const chunks = [];
    for (let i = 0; i < textToSpeak.length; i += chunkSize) {
      chunks.push(textToSpeak.slice(i, i + chunkSize));
    }

    // Speak each chunk
    chunks.forEach((chunk) => {
      try {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = id === 'from' ? fromLang : toLang;
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('SpeechSynthesis error:', error);
      }
    });
  };

  const handleMicrophoneClick = () => {
    document.getElementById('mic-button').click();
  };

  const handleSelectChange = () => {
    setFromLang(fromSelectRef.current.value);
    setToLang(toSelectRef.current.value);
  };

  useEffect(() => {
    const exchangeIcon = exchangeIconRef.current;
    const translateBtn = translateBtnRef.current;

    exchangeIcon.addEventListener("click", handleExchange);
    translateBtn.addEventListener("click", handleTranslate);

    iconsRef.current.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const { id, classList } = e.target;
        if (classList.contains("fa-copy")) {
          handleIconClick(id);
        } else if (classList.contains("fa-volume-up")) {
          handleSpeech(id);
        }
      });
    });

    return () => {
      exchangeIcon.removeEventListener("click", handleExchange);
      translateBtn.removeEventListener("click", handleTranslate);
      iconsRef.current.forEach((icon) => {
        icon.removeEventListener("click", (e) => {
          const { id, classList } = e.target;
          if (classList.contains("fa-copy")) {
            handleIconClick(id);
          } else if (classList.contains("fa-volume-up")) {
            handleSpeech(id);
          }
        });
      });
    };
  }, [fromText, toText, fromLang, toLang]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="input">
          <div className="text-input">
            <textarea
              spellCheck="false"
              className="from-text"
              placeholder="Enter text"
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              ref={fromTextRef}
            ></textarea>
            <textarea
              spellCheck="false"
              readOnly
              className="to-text"
              placeholder="Translation"
              value={toText}
              ref={toTextRef}
            ></textarea>
          </div>
          <div className="input-icon">
            <div className="microphone">
            <i
              id="mphone"
              className="fas fa-microphone"
              onClick={handleMicrophoneClick}
              ref={(el) => (iconsRef.current[4] = el)}
            ></i>
              </div>
            <Imgtotext onDetectText={(text) => setFromText(text)} />
          </div>
        </div>
       
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i
                id="from"
                className="fas fa-volume-up"
                ref={(el) => (iconsRef.current[0] = el)}
              ></i>
              <i
                id="from"
                className="fas fa-copy"
                ref={(el) => (iconsRef.current[1] = el)}
              ></i>
            </div>
            <select
              ref={fromSelectRef}
              onChange={handleSelectChange}
            >
            </select>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt" ref={exchangeIconRef}></i>
          </li>
          <li className="row to">
            <select
              ref={toSelectRef}
              onChange={handleSelectChange}
            >
            </select>
            <div className="icons">
              <i
                id="to"
                className="fas fa-volume-up"
                ref={(el) => (iconsRef.current[2] = el)}
              ></i>
              <i
                id="to"
                className="fas fa-copy"
                ref={(el) => (iconsRef.current[3] = el)}
              ></i>
            </div>
          </li>
        </ul>
      </div>
      <div className="button-wrapper">
        <button ref={translateBtnRef}>TRANSLATE</button>
      </div>
      
      <Speechtotext 
        onTranscriptChange={(transcript) => setFromText(transcript)} 
        fromLang={fromLang}
      />
    </div>
  );
};

export default Translate;
