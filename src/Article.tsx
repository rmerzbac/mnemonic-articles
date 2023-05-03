import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ReactElement } from 'react';

import ArticlePresentation from './ArticlePresentation';
import { sendToOpenAI } from './openAI';
import { makePrompt, askQuestion, multipleChoiceAnswer } from './prompts';

interface ArticleProps {
    text: string;
}

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

const Article: React.FC<ArticleProps> = ({ text }) => {
  const paragraphs = text.split('\n');

  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ReactElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textPosition = useRef(0);
  const [triggerReadText, setTriggerReadText] = useState(true);

  const readText = () => {
    console.log('text-pos-read-text', textPosition);
    if (textPosition.current >= paragraphs.length) {
        alert("Text over");
        return "";
    }

    let charCount = 0;
    let newPosition = textPosition.current;

    while (charCount < 1000 && newPosition < paragraphs.length) {
      charCount += paragraphs[newPosition].length;
      newPosition += 1;
    }

    const newText = paragraphs.slice(textPosition.current, newPosition).join('\n');
    textPosition.current = newPosition;
    console.log("Updated textPosition:", newPosition); // Add this line
    return newText;
  };

  useEffect(() => {
    console.log('text-pos', textPosition);
    if (triggerReadText) {
      sendPromptAndProcessResponse(readText());
      setTriggerReadText(false);
    }
  }, [textPosition, triggerReadText]);

  const sendPromptAndProcessResponse = async (text: string, context: string | null = null) => {
    console.log("send prompt", text);
    const prompt = makePrompt(text);
    const result = await sendToOpenAI(prompt, setIsLoading);
    const message = JSON.parse(result);
    const processedResponse = processResponse(message, context);
    setConversation(prevConversation => [...prevConversation, processedResponse]);
  };

  const processResponse = (response: QuestionResponse, context: string | null = null) => {
    const { summary, questionType, trueStatement, falseStatements } = response;
  
    const summaryList = summary ? summary.map((point, index) => <li key={index}>{point}</li>) : <></>;
    console.log("process", summary + "");
  
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
        <button onClick={() => evaluateMultipleChoiceAnswer(statement, statement === trueStatement, context ?? summary + "")}>{statement}</button>
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
    console.log("eval", summary);
    let evaluationText = <></>;
    if (isCorrect) {
        evaluationText = <><hr/><p>{answer}: <span style={{"color":"green"}}> Correct</span></p><hr/></>;
        sendPromptAndProcessResponse(readText());
    } else {
        const response = await makeEvaluationPrompt(answer, false, summary);
        const { reason } = response;
        evaluationText = 
            <><hr/><p>{answer}: 
                <span style={{"color":"red"}}> Incorrect</span>
            </p><p>{reason}</p><hr/></>;
        sendPromptAndProcessResponse(askQuestion(summary), summary);
    }
    setConversation(prevConversation => [...prevConversation, evaluationText]);
  }

  const makeEvaluationPrompt = (answer: string, isCorrect: boolean, context: string) => {
    return requestEvaluation(multipleChoiceAnswer(answer, isCorrect, context));
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
    const response = await sendToOpenAI(prompt, setIsLoading);
    const message = JSON.parse(response);
    console.log(message);
    return message;
  };

  return (
    <ArticlePresentation
      conversation={conversation}
      isLoading={isLoading}
      inputText={inputText}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Article;