import React, { useState, useEffect, ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import axios from 'axios';

import { defaultPrompt, multipleChoiceAnswer, askQuestion } from './prompts';

interface ResponseBase {
  summary: string[];
  questionType: string;
  question: string;
}

interface MultipleChoiceResponse extends ResponseBase {
  options: string[];
}

type QuestionResponse = MultipleChoiceResponse;

interface EvaluationResponse extends ResponseBase {
  evaluation: string;
  reason: string;
}

const Article: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ReactElement[]>([]);

  useEffect(() => {
    sendPromptAndProcessResponse();
  }, []);

  const sendPromptAndProcessResponse = async (text: string | null = null) => {
    console.log("Updating conversation");
    const result = await makePrompt(text);
    const message = JSON.parse(result);
    const processedResponse = processResponse(message);
    setConversation(prevConversation => [...prevConversation, processedResponse]);
  };

  const makePrompt = (text: string | null) => {
    const prompt = text ?? defaultPrompt();
    return sendToOpenAI(prompt);
  };

  const processResponse = (response: QuestionResponse) => {
    const { summary, questionType, question, options } = response;

    const summaryList = summary.map((point, index) => <li key={index}>{point}</li>);
    console.log(summary + "");
    const optionsList = questionType === 'multiple' && options.map((option, index) => (
        <li key={index}>
          <button onClick={() => evaluateMultipleChoiceAnswer(option, question, summary + "")}>{option}</button>
        </li>
      ));
  
    return (
      <>
        <ul>{summaryList}</ul>
        <p>{question}</p>
        {questionType === 'multiple' && <ol type="a">{optionsList}</ol>}
      </>
    );
  }

  const evaluateMultipleChoiceAnswer = async (answer: string, question: string, summary: string) => {
    const response = await makeEvaluationPrompt(answer, question);
    const { evaluation, reason } = response;
    const processedResponse = 
        <><hr/><p>{answer}: 
            {evaluation === 'Correct' ? 
                <span style={{"color":"green"}}> Correct</span> : 
                <span style={{"color":"red"}}> Incorrect</span>}
        </p><p>{reason}</p><hr/></>;
    setConversation(prevConversation => [...prevConversation, processedResponse]);
    if (evaluation === 'Incorrect') requestQuestion(summary);
  }

  const makeEvaluationPrompt = (answer: string, question: string) => {
    return requestEvaluation(multipleChoiceAnswer(answer, question));
  };

  const requestQuestion = (text: string) => {
    return sendPromptAndProcessResponse(askQuestion(text));
  };

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

  const requestEvaluation = async (prompt: string) : Promise<EvaluationResponse> => {
    const response = await sendToOpenAI(prompt);
    const message = JSON.parse(response);
    console.log(message);
    return message;
  }

  const sendToOpenAI = async (prompt: string): Promise<string> => {
    console.log("prompt", prompt);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        messages: [{"role": "user","content":prompt}],
        model: "gpt-3.5-turbo",
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
  
      const messageJSON = response.data.choices[0].message.content.trim();
      console.log(messageJSON);
      return messageJSON;
    } catch (error) {
      console.error('Error in API request:', error);
      return "";
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
