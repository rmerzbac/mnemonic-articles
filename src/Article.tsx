import React, { useState, useEffect, ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import axios from 'axios';

import { defaultPrompt, multipleChoiceAnswer, askQuestion } from './prompts';

import loadingGif from './loading.gif';

interface ResponseBase {
  summary: string[];
  questionType: string;
}

interface MultipleChoiceResponse extends ResponseBase {
  trueStatement: string;
  falseStatements: string[];
}

type QuestionResponse = MultipleChoiceResponse;

interface EvaluationResponse extends ResponseBase {
  evaluation: string;
  reason: string;
}

const Article: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ReactElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const { summary, questionType, trueStatement, falseStatements } = response;
  
    const summaryList = summary ? summary.map((point, index) => <li key={index}>{point}</li>) : <></>;
    console.log(summary + "");
  
    // Combine trueStatement and falseStatements
    const allStatements = [trueStatement, ...falseStatements];
  
    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
  
    shuffleArray(allStatements);
  
    const optionsList = questionType === 'multiple' && allStatements.map((statement, index) => (
      <li key={index}>
        <button onClick={() => evaluateMultipleChoiceAnswer(statement, statement === trueStatement, summary + "")}>{statement}</button>
      </li>
    ));
  
    return (
      <>
        <ul>{summaryList}</ul>
        <p>Select the true statement:</p>
        {questionType === 'multiple' && <ol type="a">{optionsList}</ol>}
      </>
    );
  };

  const evaluateMultipleChoiceAnswer = async (answer: string, isCorrect: boolean, summary: string) => {
    let evaluationText = <></>;
    if (isCorrect) {
        evaluationText = <><hr/><p>{answer}: <span style={{"color":"green"}}> Correct</span></p><hr/></>;
    } else {
        const response = await makeEvaluationPrompt(answer, false);
        const { reason } = response;
        evaluationText = 
            <><hr/><p>{answer}: 
                <span style={{"color":"red"}}> Incorrect</span>
            </p><p>{reason}</p><hr/></>;
    }
    setConversation(prevConversation => [...prevConversation, evaluationText]);
    if (!isCorrect) requestQuestion(summary);
  }

  const makeEvaluationPrompt = (answer: string, isCorrect: boolean) => {
    return requestEvaluation(multipleChoiceAnswer(answer, isCorrect));
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
    setIsLoading(true);
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
      setIsLoading(false);
      return messageJSON;
    } catch (error) {
      console.error('Error in API request:', error);
      setIsLoading(false);
      return "";
    }
  };

  return (
    <div className="openai-chat">
      <div className="conversation">
        {conversation.map((line, index) => (
          <React.Fragment key={index}>{line}</React.Fragment>
        ))}
        {isLoading && <img src={loadingGif} alt="Loading..." />}
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
