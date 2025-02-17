import React, { useState } from 'react';

interface CopyButtonProps {
  code: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2.5 top-2.5 px-2.5 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};


export default CopyButton;
