import React, { useState } from 'react';

interface ToggleComponentProps {
  original: string;
  summary: React.ReactNode;
}

const ToggleComponent: React.FC<ToggleComponentProps> = ({original, summary}) => {
  const [showSummary, setShowSummary] = useState(false);

  const formatTextWithParagraphs = (text: string) => {
    return (
      <div className="description">
        {text.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  };

  const originalWithParagraphs = formatTextWithParagraphs(original);

  return (
    <div>
      <button onClick={() => setShowSummary(!showSummary)}>
        {showSummary ? 'Show Original Text' : 'Show Summary'}
      </button>
      {showSummary ? summary : originalWithParagraphs}
    </div>
  );
};

export default ToggleComponent;
