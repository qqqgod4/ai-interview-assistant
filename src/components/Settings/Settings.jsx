import React, { useState } from 'react';
import './Settings.css';

/**
 * Settings Component
 * 
 * Компонент настроек для управления конфигурацией ИИ-ассистента интервью.
 * 
 * Функциональность:
 * - Выбор модели ИИ (GPT-4, Claude, Gemini)
 * - Ввод API-ключей для выбранной модели (заглушка)
 * - Сохранение настроек с валидацией
 * - Управление состоянием формы
 * 
 * Интерфейс:
 * - Выпадающий список для выбора модели
 * - Текстовое поле для ввода API-ключа (с маскировкой)
 * - Кнопка "Сохранить" с индикацией состояния
 * - Сообщения об успешном сохранении или ошибках
 */
const Settings = () => {
  // Состояние выбранной модели ИИ
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  
  // Состояние API-ключа
  const [apiKey, setApiKey] = useState('');
  
  // Состояние процесса сохранения
  const [isSaving, setIsSaving] = useState(false);
  
  // Состояние сообщения (успех/ошибка)
  const [message, setMessage] = useState({ text: '', type: '' });

  // Доступные модели ИИ
  const aiModels = ['GPT-4', 'Claude', 'Gemini'];

  /**
   * Обработчик изменения модели
   */
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setMessage({ text: '', type: '' }); // Очистка сообщений
  };

  /**
   * Обработчик изменения API-ключа
   */
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    setMessage({ text: '', type: '' }); // Очистка сообщений
  };

  /**
   * Валидация настроек
   */
  const validateSettings = () => {
    if (!selectedModel) {
      setMessage({ text: 'Выберите модель ИИ', type: 'error' });
      return false;
    }
    
    if (!apiKey || apiKey.trim().length === 0) {
      setMessage({ text: 'Введите API-ключ', type: 'error' });
      return false;
    }
    
    if (apiKey.length < 20) {
      setMessage({ text: 'API-ключ слишком короткий', type: 'error' });
      return false;
    }
    
    return true;
  };

  /**
   * Обработчик сохранения настроек
   */
  const handleSave = async () => {
    // Валидация перед сохранением
    if (!validateSettings()) {
      return;
    }

    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Симуляция сохранения (заглушка)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Реализовать реальное сохранение в localStorage или backend
      // localStorage.setItem('aiModel', selectedModel);
      // localStorage.setItem('apiKey', apiKey);
      
      console.log('Настройки сохранены:', { selectedModel, apiKey: '***' });
      
      setMessage({ 
        text: `Настройки успешно сохранены! Модель: ${selectedModel}`, 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: 'Ошибка при сохранении настроек', 
        type: 'error' 
      });
      console.error('Ошибка сохранения:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Настройки ИИ-ассистента</h2>
        <p className="settings-description">
          Выберите модель ИИ и укажите API-ключ для работы ассистента
        </p>
      </div>

      <div className="settings-form">
        {/* Выбор модели ИИ */}
        <div className="form-group">
          <label htmlFor="model-select">
            Модель ИИ:
          </label>
          <select
            id="model-select"
            className="model-select"
            value={selectedModel}
            onChange={handleModelChange}
            disabled={isSaving}
          >
            {aiModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <span className="field-hint">
            Выберите предпочитаемую модель для генерации ответов
          </span>
        </div>

        {/* Ввод API-ключа */}
        <div className="form-group">
          <label htmlFor="api-key-input">
            API-ключ:
          </label>
          <input
            id="api-key-input"
            type="password"
            className="api-key-input"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Введите ваш API-ключ"
            disabled={isSaving}
          />
          <span className="field-hint">
            Ключ будет храниться локально и использоваться для запросов к {selectedModel}
          </span>
        </div>

        {/* Сообщения */}
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Кнопка сохранения */}
        <div className="form-actions">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Информационный блок */}
      <div className="settings-info">
        <h3>Как получить API-ключ?</h3>
        <ul>
          <li><strong>GPT-4:</strong> Зарегистрируйтесь на platform.openai.com</li>
          <li><strong>Claude:</strong> Получите ключ на console.anthropic.com</li>
          <li><strong>Gemini:</strong> Создайте ключ в Google AI Studio</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
