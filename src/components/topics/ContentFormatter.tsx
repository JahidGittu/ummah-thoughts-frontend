"use client";

import React from 'react';
import styles from './TopicMessenger.module.css';

interface ContentFormatterProps {
  content: string;
}

export const ContentFormatter: React.FC<ContentFormatterProps> = ({ 
  content
}) => {
  const parseInlineContent = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    // Process bold: **text**
    let match;
    const boldRegex = /\*\*(.+?)\*\*/g;
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(text.substring(lastIndex, match.index));
      }
      result.push(
        <strong key={`bold-${key++}`}>{match[1]}</strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    // If no bold found, try italic
    if (result.length === 0) {
      const italicRegex = /\*(.+?)\*/g;
      while ((match = italicRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          result.push(text.substring(lastIndex, match.index));
        }
        result.push(
          <em key={`italic-${key++}`}>{match[1]}</em>
        );
        lastIndex = italicRegex.lastIndex;
      }
    }

    // If no formatting found, try code
    if (result.length === 0) {
      const codeRegex = /`(.+?)`/g;
      while ((match = codeRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          result.push(text.substring(lastIndex, match.index));
        }
        result.push(
          <code key={`code-${key++}`}>{match[1]}</code>
        );
        lastIndex = codeRegex.lastIndex;
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    // If no formatting was applied, return original text
    return result.length === 0 ? [text] : result;
  };

  const parseContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Split by paragraphs (double newline)
    const paragraphs = text.split(/\n\n+/);

    paragraphs.forEach((paragraph, pIndex) => {
      const trimmed = paragraph.trim();
      
      if (!trimmed) return;

      // Handle quote blocks
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed
          .split('\n')
          .map(line => line.replace(/^>\s*/, ''))
          .join('\n');
        
        elements.push(
          <blockquote key={`quote-${pIndex}`} className={styles.quoteBlock}>
            {parseInlineContent(quoteText)}
          </blockquote>
        );
        return;
      }

      // Handle unordered lists
      if (trimmed.match(/^[-*•]\s/)) {
        const listItems = trimmed
          .split('\n')
          .filter(line => line.trim().match(/^[-*•]\s/));
        
        elements.push(
          <ul key={`list-${pIndex}`} style={{ margin: '12px 0 12px 20px' }}>
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`} style={{ margin: '6px 0' }}>
                {parseInlineContent(item.replace(/^[-*•]\s*/, ''))}
              </li>
            ))}
          </ul>
        );
        return;
      }

      // Handle ordered lists
      if (trimmed.match(/^\d+\.\s/)) {
        const listItems = trimmed
          .split('\n')
          .filter(line => line.trim().match(/^\d+\.\s/));
        
        elements.push(
          <ol key={`olist-${pIndex}`} style={{ margin: '12px 0 12px 20px' }}>
            {listItems.map((item, idx) => (
              <li key={`oli-${idx}`} style={{ margin: '6px 0' }}>
                {parseInlineContent(item.replace(/^\d+\.\s*/, ''))}
              </li>
            ))}
          </ol>
        );
        return;
      }

      // Handle regular paragraphs
      elements.push(
        <p key={`p-${pIndex}`} style={{ margin: '12px 0' }}>
          {parseInlineContent(trimmed)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className={styles.contentText}>
      {parseContent(content)}
    </div>
  );
};
