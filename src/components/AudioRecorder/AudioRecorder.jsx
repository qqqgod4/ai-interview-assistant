import React, { useState, useEffect, useRef } from 'react';
import './AudioRecorder.css';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [micStatus, setMicStatus] = useState('inactive'); // 'inactive', 'active', 'error'
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Проверка поддержки Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Web Speech API не поддерживается в этом браузере');
      setMicStatus('error');
      return;
    }

    // Инициализация Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'ru-RU';

    // Обработчик результатов распознавания
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setRecognizedText(prev => prev + finalTranscript);
    };

    // Обработчик ошибок
    recognitionRef.current.onerror = (event) => {
      console.error('Ошибка распознавания речи:', event.error);
      setMicStatus('error');
    };

    // Обработчик окончания распознавания
    recognitionRef.current.onend = () => {
      if (isAutoMode && isRecording) {
        recognitionRef.current.start();
      } else {
        setIsRecording(false);
        setMicStatus('inactive');
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isAutoMode, isRecording]);

  // Включение/выключение микрофона
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setMicStatus('inactive');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setMicStatus('active');
      } catch (error) {
        console.error('Ошибка запуска распознавания:', error);
        setMicStatus('error');
      }
    }
  };

  // Переключение режима
  const toggleMode = () => {
    setIsAutoMode(!isAutoMode);
  };

  // Экспорт текста (пока без функционала)
  const handleExport = () => {
    console.log('Экспорт:', recognizedText);
    // TODO: реализовать экспорт в файл
  };

  // Очистка текста
  const clearText = () => {
    setRecognizedText('');
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <h2>Распознавание речи</h2>
        <div className="mic-status">
          Статус: 
          <span className={`status-indicator status-${micStatus}`}>
            {micStatus === 'active' ? 'Активен' : micStatus === 'error' ? 'Ошибка' : 'Неактивен'}
          </span>
        </div>
      </div>

      <div className="recorder-controls">
        <button 
          onClick={toggleRecording}
          className={`mic-button ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? '🎤 Остановить' : '🎤 Начать запись'}
        </button>

        <button 
          onClick={toggleMode}
          className="mode-button"
        >
          Режим: {isAutoMode ? 'Авто' : 'Ручной'}
        </button>

        <button 
          onClick={clearText}
          className="clear-button"
        >
          Очистить
        </button>
      </div>

      <div className="recognized-text-container">
        <h3>Распознанный текст:</h3>
        <div className="text-output">
          {recognizedText || 'Текст появится здесь...'}
        </div>
      </div>

      <div className="export-controls">
        <button 
          onClick={handleExport}
          className="export-button"
          disabled={!recognizedText}
        >
          Экспорт текста
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
