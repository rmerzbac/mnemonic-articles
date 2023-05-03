import React, { ReactElement } from 'react';

import loadingGif from './loading.gif';

interface ArticlePresentationProps {
  conversation: ReactElement[];
  isLoading: boolean;
  inputText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.KeyboardEvent<HTMLTextAreaElement>) => Promise<void>;
}

const ArticlePresentation: React.FC<ArticlePresentationProps> = ({
  conversation,
  isLoading,
  inputText,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <div className="openai-chat">
      <div className="conversation">
        {conversation.map((line, index) => (
          <React.Fragment key={index}>{line}</React.Fragment>
        ))}
        {isLoading && <img src={loadingGif} alt="Loading..." />}
      </div>
      <textarea
        hidden
        required
        placeholder="Type your message here..."
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleSubmit}
      />
    </div>
  );
};

export default ArticlePresentation;
