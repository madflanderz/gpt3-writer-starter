import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "Write me a airbnb review in {{language}} for my guest {{guest}} ";
const generateAction = async (req, res) => {
  const { userInput, language = "english" } = req.body;

  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const promt = basePromptPrefix
    .replace("{{language}}", language)
    .replace("{{guest}}", userInput);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${promt}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
