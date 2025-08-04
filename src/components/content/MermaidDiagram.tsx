import React, { useCallback, useEffect, useState, useRef } from 'react';
import mermaid, { MermaidConfig } from 'mermaid';
import SaveImageButton from '../common/buttons/SaveImageButton';

interface MermaidDiagramProps {
  code: string;
}

interface MermaidRenderResult {
  svg: string;
}

const MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  logLevel: 'error',
  flowchart: {
    htmlLabels: true,
    useMaxWidth: true
  }
};

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const elementId = useRef<string>(`mermaid-${Math.random().toString(36).slice(2, 11)}`);

  const pretreatCode = useCallback((rawCode: string): string => {
    let processedCode = rawCode.trim();
    
    // Remplacer |> par | et ajouter des underscores entre les mots dans les nœuds
    processedCode = processedCode
      .replace(/\|>/g, '|')
      .replace(/\[([^\]]+)\]/g, (_match, p1: string) => `[${p1.replace(/\s+/g, '_')}]`)
      
      // Correction des flèches avec étiquettes
      .replace(/-->\|([^|]+)\|>/g, (_match, label: string) => `-->|${label.trim().replace(/\s+/g, '_')}|`)
      
      // Conversion des diagrammes spécifiques
      .replace(/^componentDiagram\s*\n/m, () => {
        const hasClassFeatures = processedCode.includes('class') || processedCode.includes('extends');
        return hasClassFeatures ? 'classDiagram\n' : 'graph TD\n';
      })
      .replace(/^deploymentDiagram\s*\n/m, 'graph TD\n')
      
      // Conversion des composants en sous-graphes
      .replace(/component\s+{([^}]*)}/g, (_match, content: string) => `subgraph ${content.trim()}`)
      
      // Gestion des états avec propriétés
      .replace(/state\s+"([^"]+)"\s*{([^}]*)}/g, (_match, stateName: string, properties: string) => {
        const lines = properties.trim().split('\n');
        const result = `state "${stateName}"`;
        
        const notes = lines
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => `note right of "${stateName}": ${line}`);
        
        return `${result}\n${notes.join('\n')}`;
      });

    return processedCode;
  }, []);

  const renderDiagram = useCallback(async (processedCode: string): Promise<void> => {
    try {
      // Initialiser mermaid avec la configuration
      mermaid.initialize(MERMAID_CONFIG);

      // Vérifier la syntaxe
      await mermaid.parse(processedCode);

      // Rendre le diagramme
      const { svg } = await mermaid.render(elementId.current, processedCode) as MermaidRenderResult;
      setSvgContent(svg);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(`Erreur de rendu : ${error.message || 'Erreur inconnue'}`);
      setSvgContent('');
    }
  }, [elementId]);

  useEffect(() => {
    const processAndRender = async (): Promise<void> => {
      try {
        let processedCode = pretreatCode(code);
        
        // S'assurer que le code commence par un type de diagramme
        const regex = /^(graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|flowchart|gantt|pie)/i;
        if (!regex.exec(processedCode)) {
          processedCode = `graph TD\n${processedCode}`;
        }

        await renderDiagram(processedCode);
      } catch (err) {
        const error = err as Error;
        setError(`Erreur de traitement : ${error.message}`);
      }
    };

    void processAndRender();
  }, [code, pretreatCode, renderDiagram]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
        <p className="font-semibold text-red-800 mb-2">Erreur de rendu du diagramme:</p>
        <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>
        <div className="mt-4">
          <details>
            <summary className="cursor-pointer text-red-600 hover:text-red-800">
              Code source du diagramme
            </summary>
            <pre className="mt-2 p-4 bg-white rounded-md">{code}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      {svgContent && (
        <div>
          <div
            className="bg-white p-4 border border-gray-200 rounded-lg overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <SaveImageButton svgContent={svgContent} />
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;
