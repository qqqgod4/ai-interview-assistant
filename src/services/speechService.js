/**
 * Сервис для работы с Web Speech API
 * Обеспечивает распознавание речи в браузере
 */

class SpeechService {
  constructor() {
    // Проверка поддержки Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Web Speech API не поддерживается в этом браузере');
      this.supported = false;
      return;
    }

    this.supported = true;
    this.recognition = new SpeechRecognition();
    this.isListening = false;
    this.currentTranscript = '';
    
    // Настройки распознавания
    this.recognition.continuous = true; // Непрерывное распознавание
    this.recognition.interimResults = true; // Промежуточные результаты
    this.recognition.lang = 'ru-RU'; // Язык по умолчанию
    
    // Обработчики событий
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
    
    this._setupEventHandlers();
  }

  /**
   * Настройка обработчиков событий Web Speech API
   */
  _setupEventHandlers() {
    if (!this.supported) return;

    // Обработка результатов распознавания
    this.recognition.onresult = (event) => {
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

      this.currentTranscript = finalTranscript || interimTranscript;

      if (this.onResultCallback) {
        this.onResultCallback({
          transcript: this.currentTranscript,
          isFinal: finalTranscript.length > 0,
          interim: interimTranscript
        });
      }
    };

    // Обработка ошибок
    this.recognition.onerror = (event) => {
      console.error('Ошибка распознавания речи:', event.error);
      
      if (this.onErrorCallback) {
        this.onErrorCallback({
          error: event.error,
          message: this._getErrorMessage(event.error)
        });
      }
    };

    // Обработка окончания распознавания
    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  /**
   * Получение читаемого сообщения об ошибке
   */
  _getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'Речь не обнаружена',
      'audio-capture': 'Микрофон недоступен',
      'not-allowed': 'Доступ к микрофону запрещен',
      'network': 'Ошибка сети',
      'aborted': 'Распознавание прервано',
      'language-not-supported': 'Язык не поддерживается'
    };
    
    return errorMessages[error] || 'Неизвестная ошибка';
  }

  /**
   * Запуск распознавания речи
   */
  start() {
    if (!this.supported) {
      console.error('Web Speech API не поддерживается');
      return false;
    }

    if (this.isListening) {
      console.warn('Распознавание уже запущено');
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.currentTranscript = '';
      return true;
    } catch (error) {
      console.error('Ошибка запуска распознавания:', error);
      return false;
    }
  }

  /**
   * Остановка распознавания речи
   */
  stop() {
    if (!this.supported) {
      return false;
    }

    if (!this.isListening) {
      console.warn('Распознавание не активно');
      return false;
    }

    try {
      this.recognition.stop();
      return true;
    } catch (error) {
      console.error('Ошибка остановки распознавания:', error);
      return false;
    }
  }

  /**
   * Получение текущего текста результата
   */
  getCurrentTranscript() {
    return this.currentTranscript;
  }

  /**
   * Установка языка распознавания
   */
  setLanguage(lang) {
    if (!this.supported) return;
    this.recognition.lang = lang;
  }

  /**
   * Установка callback для обработки результатов
   */
  onResult(callback) {
    this.onResultCallback = callback;
  }

  /**
   * Установка callback для обработки ошибок
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * Установка callback для обработки окончания
   */
  onEnd(callback) {
    this.onEndCallback = callback;
  }

  /**
   * Проверка поддержки API
   */
  isSupported() {
    return this.supported;
  }

  /**
   * Проверка статуса прослушивания
   */
  getIsListening() {
    return this.isListening;
  }
}

// Экспорт единственного экземпляра сервиса (singleton)
const speechService = new SpeechService();
export default speechService;
