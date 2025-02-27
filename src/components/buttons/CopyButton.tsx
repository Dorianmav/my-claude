import React, { useState, forwardRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { Toast } from '../ui/toast';

interface CopyButtonProps {
  code: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(({ code }, ref) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setShowToast(true);
    }
  };

  return (
    <>
      <button
        ref={ref}
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white transition-colors"
        title="Copier le code (Ctrl+C)"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      {showToast && (
        <Toast
          message={copied ? "Code copié !" : "Erreur lors de la copie"}
          type={copied ? "success" : "error"}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
});

CopyButton.displayName = 'CopyButton';

export default CopyButton;
