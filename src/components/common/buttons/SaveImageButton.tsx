import React from 'react';
import { Download } from 'lucide-react';

interface SaveImageButtonProps {
  svgContent: string;
}

const SaveImageButton: React.FC<SaveImageButtonProps> = ({ svgContent }) => {
  const handleSave = () => {
    // Créer un blob avec le contenu SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien temporaire et déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleSave}
      className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      title="Télécharger le diagramme en SVG"
    >
      <Download size={16} />
      <span>Télécharger SVG</span>
    </button>
  );
};

export default SaveImageButton;
