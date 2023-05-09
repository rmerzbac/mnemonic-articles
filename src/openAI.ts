import axios from 'axios';

const MODEL = "gpt-3.5-turbo";
const MAX_TOKENS = 500;
const TEMPERATURE = .3;

export const sendToOpenAI = async (
  prompt: string,
  setIsLoading: (value: boolean) => void,
): Promise<string> => {
  console.log("prompt", prompt);
  setIsLoading(true);
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [{"role": "user", "content": prompt}],
      model: MODEL,
      max_tokens: MAX_TOKENS,
      n: 1,
      stop: null,
      temperature: TEMPERATURE,
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

export const parseJSON = (message: string, triesRemaining: number = 4) : any=> {
  console.log("Parsing", message);
  if (triesRemaining <= 0) return "";
  try {
    const json = JSON.parse(message);
    console.log("json", json);
    return json;
  } catch (error) {
    console.error('Error parsing JSON', error);
    return parseJSON(message, triesRemaining - 1);
  }
}
