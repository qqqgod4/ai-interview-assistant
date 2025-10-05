import React, { useState } from 'react';
import './Chat.css';

// Компонент-заглушка для подсветки кода
const CodeHighlight = ({ code, language }) => {
  return (
    <pre className="code-block">
      <code className={`language-${language || 'javascript'}`}>
        {code}
      </code>
    </pre>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Здравствуйте! Я готов помочь вам с подготовкой к собеседованию.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Имитация ответа ассистента (позже будет заменено на реальный API)
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: 'Спасибо за ваш вопрос. Это временный ответ.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Interview Assistant</h2>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message message-${message.type}`}
          >
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {/* Пример использования заглушки для подсветки кода */}
              {message.code && (
                <CodeHighlight
                  code={message.code}
                  language={message.language}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваше сообщение..."
          rows="3"
        />
        <button
          onClick={handleSendMessage}
          disabled={inputText.trim() === ''}
          className="send-button"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
