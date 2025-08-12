import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownWithMath = ({ content }) => {
  // Type checking and conversion to prevent errors
  const getStringContent = (content) => {
    if (content === null || content === undefined) {
      return '';
    }
    
    if (typeof content === 'string') {
      return content;
    }
    
    if (typeof content === 'object') {
      // If it's an object, try to extract meaningful text
      if (content.question) {
        return content.question;
      }
      if (content.text) {
        return content.text;
      }
      if (content.content) {
        return content.content;
      }
      // If it's an array, join with newlines
      if (Array.isArray(content)) {
        return content.join('\n');
      }
      // Last resort: stringify the object
      console.warn('MarkdownWithMath received object, converting to string:', content);
      return JSON.stringify(content);
    }
    
    // Convert other types to string
    return String(content);
  };

  const stringContent = getStringContent(content);

  return (
    <ReactMarkdown
      children={stringContent}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
};

export default MarkdownWithMath;