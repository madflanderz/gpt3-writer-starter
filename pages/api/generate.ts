import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "Write an airbnb review from the perspective of a host in {{language}} for the guest {{guest}}\n";
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
    temperature: 0.6,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
