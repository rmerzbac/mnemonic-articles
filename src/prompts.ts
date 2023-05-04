import React from "react";

// const demoText = "The Battle of Cannae (/ˈkæni, -eɪ, -aɪ/;[b] Latin: [ˈkanːae̯]) was a key engagement of the Second Punic War between the Roman Republic and Carthage, fought on 2 August 216 BC near the ancient village of Cannae in Apulia, southeast Italy. The Carthaginians and their allies, led by Hannibal, surrounded and practically annihilated a larger Roman and Italian army under the consuls Lucius Aemilius Paullus and Gaius Terentius Varro. It is regarded as one of the greatest tactical feats in military history and one of the worst defeats in Roman history.\n";

export function makeTitlePrompt(text: string) {
    return "Based on this text, come up with a simple title. \n\
    Respond in the form \n\
    {\"title\": \"<your title>\"}\
    \n\n" + text;
}

type PromptListType = {
    [key: number]: string;
};

const promptList: PromptListType = {
    0: "Write an introductory paragraph about {topic}.\n",
    1: "Write a second paragraph that elaborates on the first.\n",
    2: "Begin to get more specific.\n",
    3: "Continue to dive deeper into the topic, getting gradually more and more complex.\n",
};

function getPrompt(queryNumber: number, topic: string | null = null): string {
    let prompt: string;
    if (queryNumber > 3) {
        queryNumber = 3;
    }
    prompt = promptList[queryNumber];

    if (topic) {
        prompt = prompt.replace("{topic}", topic);
    }
    return prompt;
};

const questionOptions: PromptListType = {
    0: "free response",
    1: "true/false",
    2: "multiple choice"
}

export function defaultPrompt(text : string, isSummarizing : boolean) {
    // const randomNum = Math.floor(Math.random() * 3);
    
    // Add other options
    return (isSummarizing && "Summarize this text thoroughly in bullet points. ") +
    "Generate three false statements about the text and one true statement. \
    Make sure the true statement is just as terse as the false statements.\n\
    Respond in the form \n\
    {" + (isSummarizing && "\"summary\": [<\"your bullet points\">],") + "\"questionType\": \"multiple\", \"trueStatement\":\"<true statement>\",\"falseStatements\":[<\"false statements\">] }\
    \n\n" + text;
}

export const makePrompt = (text: string, isSummarizing : boolean) => {
    // will add more prompts
    const prompt = defaultPrompt(text, isSummarizing);
    return prompt;
};

export function askQuestion(text: string) {
    return multipleChoiceQuestion(text);
}

export function multipleChoiceQuestion(text: string) {
    return "Generate three false statements about the text and one true statement. \
    Make sure the true statement is just as terse as the false statements.\n\
    Respond in the form \n\
    {\"questionType\": \"multiple\", \"trueStatement\":\"<true statement>\",\"falseStatements\":[<\"false statements\">] }\
    \n\n" + text;
}

export function multipleChoiceAnswer(text: string, isCorrect: boolean, context: string) {
    return isCorrect ? 
        "Why is " + text + " a true statement?\n\
        Respond in the form \n\
        {\"reason\": \"<reason>\"} \n\n\
        Here is the context:\n" + context:
        "Why is " + text + " not a true statement?\n\
        Respond in the form \n\
        {\"reason\": \"<reason>\"} \n\n\
        Here is the context:\n" + context;
}
  