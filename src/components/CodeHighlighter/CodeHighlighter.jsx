import React from 'react';
import PropTypes from 'prop-types';
import './CodeHighlighter.css';

/**
 * Компонент для подсветки синтаксиса кода
 * Простая заглушка с возможностью приёма текста кода и языка
 */
const CodeHighlighter = ({ code, language = 'javascript' }) => {
  return (
    <div className="code-highlighter">
      <div className="code-highlighter__header">
        <span className="code-highlighter__language">{language}</span>
      </div>
      <pre className="code-highlighter__pre">
        <code className={`code-highlighter__code language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

CodeHighlighter.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string
};

export default CodeHighlighter;
