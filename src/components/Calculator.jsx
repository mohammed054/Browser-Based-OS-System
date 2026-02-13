import { useState, useEffect, useCallback } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInput = useCallback((value) => {
    if (isCalculated) {
      // If we just calculated, start fresh with new input
      setExpression(value);
      setDisplay(value);
      setResult('');
      setIsCalculated(false);
    } else {
      const newExpression = expression + value;
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  }, [expression, isCalculated]);

  const handleCalculate = useCallback(() => {
    if (!expression) return;

    try {
      // Replace % with /100 for calculation
      let calcExpression = expression.replace(/%/g, '/100');

      // Use Function constructor for safer evaluation
      const result = Function('"use strict"; return (' + calcExpression + ')')();

      if (isNaN(result) || !isFinite(result)) {
        setResult('Error');
      } else {
        setResult(result.toString());
        setDisplay(result.toString());
        setIsCalculated(true);
      }
    } catch {
      setResult('Error');
      setDisplay('Error');
      setIsCalculated(true);
    }
  }, [expression]);

  const handleClear = useCallback(() => {
    setExpression('');
    setDisplay('');
    setResult('');
    setIsCalculated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (isCalculated) {
      handleClear();
    } else {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  }, [expression, handleClear, isCalculated]);

  const handleMemoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  const handleMemoryRecall = useCallback(() => {
    if (memory !== 0) {
      handleInput(memory.toString());
    }
  }, [handleInput, memory]);

  const handleMemoryAdd = useCallback(() => {
    if (result && !isNaN(parseFloat(result))) {
      setMemory(prev => prev + parseFloat(result));
    }
  }, [result]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;

      if (key >= '0' && key <= '9') {
        handleInput(key);
      } else if (['+', '-', '*', '/', '%'].includes(key)) {
        handleInput(key);
      } else if (key === 'Enter' || key === '=') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '.') {
        handleInput('.');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleBackspace, handleCalculate, handleClear, handleInput]);

  const buttons = [
    // Row 1: C, MC, MR, M+
    { label: 'C', action: handleClear, className: 'function' },
    { label: 'MC', action: handleMemoryClear, className: 'memory' },
    { label: 'MR', action: handleMemoryRecall, className: 'memory' },
    { label: 'M+', action: handleMemoryAdd, className: 'memory' },
    // Row 2: 7, 8, 9, ÷
    { label: '7', action: () => handleInput('7') },
    { label: '8', action: () => handleInput('8') },
    { label: '9', action: () => handleInput('9') },
    { label: '÷', action: () => handleInput('/'), className: 'operator' },
    // Row 3: 4, 5, 6, ×
    { label: '4', action: () => handleInput('4') },
    { label: '5', action: () => handleInput('5') },
    { label: '6', action: () => handleInput('6') },
    { label: '×', action: () => handleInput('*'), className: 'operator' },
    // Row 4: 1, 2, 3, =
    { label: '1', action: () => handleInput('1') },
    { label: '2', action: () => handleInput('2') },
    { label: '3', action: () => handleInput('3') },
    { label: '=', action: handleCalculate, className: 'equals' },
    // Row 5: %, 0, ., =
    { label: '%', action: () => handleInput('%'), className: 'operator' },
    { label: '0', action: () => handleInput('0') },
    { label: '.', action: () => handleInput('.') },
    { label: '=', action: handleCalculate, className: 'equals' }
  ];

  return (
    <div className="calculator-app">
      <div className="calculator-display">
        <div className="display-text">
          {display || '0'}
        </div>
      </div>
      <div className="calculator-buttons">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`calc-button ${button.className || ''}`}
            onClick={button.action}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
