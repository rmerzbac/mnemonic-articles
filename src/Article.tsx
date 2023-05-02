import React, { useState, useEffect, ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import axios from 'axios';

import { defaultPrompt } from './prompts';

interface Response {
  summary: string[];
  questionType: string;
  question: string;
  options: string[];
}

const Article: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ReactElement[]>([]);

  useEffect(() => {
    const sendPromptAndProcessResponse = async () => {
      console.log("Updating conversation");
      const result = await makePrompt();
      const processedResponse = processResponse(result);
      setConversation(prevConversation => [...prevConversation, processedResponse]);
    };
    sendPromptAndProcessResponse();
  }, []);

  const makePrompt = () => {
    return sendToOpenAI(defaultPrompt(), conversation);
  };

  const processResponse = (response: Response) => {
    const { summary, questionType, question, options } = response;
  
    const summaryList = summary.map((point, index) => <li key={index}>{point}</li>);
    const optionsList = questionType === 'multiple' && options.map((option, index) => <li key={index}>{option}</li>);
  
    return (
      <>
        <ul>{summaryList}</ul>
        <p>{question}</p>
        {questionType === 'multiple' && <ol type="a">{optionsList}</ol>}
      </>
    );
  }  

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setConversation(prevConversation => [...prevConversation, <p>User: {inputText}</p>]);
      setInputText('');
    }
  };

  const sendToOpenAI = async (prompt: string, conversation: ReactElement[]): Promise<Response> => {
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: prompt,
        model: "text-davinci-003",
        max_tokens: 300, // Set your desired response length
        n: 1,
        stop: null,
        temperature: 1,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.REACT_APP_OPEN_AI_API_KEY,
        },
      });
  
      const messageJSON = response.data.choices[0].text.trim();
      console.log(messageJSON);
      const message = JSON.parse(messageJSON);
      console.log(message);
      return message;
    } catch (error) {
      console.error('Error in API request:', error);
      return { summary: [], questionType: '', question: 'Error: Unable to process your request.', options: [] };
    }
  };

  return (
    <div className="openai-chat">
      <div className="conversation">
        {conversation.map((line, index) => (
          <React.Fragment key={index}>{line}</React.Fragment>
        ))}
      </div>
      <textarea
        required
        placeholder="Type your message here..."
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleSubmit}
      />
    </div>
  );
};

export default Article;
