import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  type?: 'text' | 'number' | 'date';
  min?: number;
  step?: number;
}

export function EditableText({
  value,
  onChange,
  placeholder = 'Enter text...',
  multiline = false,
  className = '',
  type = 'text',
  min,
  step
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== 'date') {
        // Select all text when editing starts, except for date inputs
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  const displayValue = value || placeholder;

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-blue-50 border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-blue-500 w-full resize-none ${className}`}
          rows={Math.max(2, tempValue.split('\n').length)}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-blue-50 border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
        min={min}
        step={step}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:bg-gray-100 px-1 py-0.5 rounded transition-colors inline-block min-w-[20px] min-h-[20px] ${
        !value ? 'text-gray-400 italic' : ''
      } ${className}`}
      style={{ whiteSpace: multiline ? 'pre-wrap' : 'normal' }}
    >
      {type === 'date' && value ? new Date(value).toLocaleDateString() : displayValue}
    </span>
  );
}
