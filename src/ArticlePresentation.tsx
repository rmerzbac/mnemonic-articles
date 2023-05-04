import React, { ReactElement } from 'react';
import HomeIcon from './HomeIcon';

import loadingGif from './loading.gif';

interface ArticlePresentationProps {
  conversation: ReactElement[];
  isLoading: boolean;
  inputText: string;
  titleText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.KeyboardEvent<HTMLTextAreaElement>) => Promise<void>;
}

const ArticlePresentation: React.FC<ArticlePresentationProps> = ({
  conversation,
  isLoading,
  inputText,
  titleText,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <div>
        <HomeIcon />
        <div className="body">
        
        <h1 className="title">{titleText}</h1>
        <div className="conversation">
            {conversation.map((line, index) => (
            <React.Fragment key={index}>{line}</React.Fragment>
            ))}
            {isLoading && <img id="loading" src={loadingGif} alt="Loading..." />}
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
    </div>
  );
};

export default ArticlePresentation;
