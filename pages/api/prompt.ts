import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Voici une conversation avec un assistant basé sur une IA. Cet assistant est utile, creatif, malin, et très amical.\n\nHumain: Bonjout, comment allez-vous ?\nIA: Je suis une IA créée par OpenAI. Comment puis-je vous aider ?\nHumain: " +
      req.body.message +
      "\nIA: ",
    temperature: 0.7,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: ["Humain: ", "IA: "],
  });
  if (completion.statusText === "OK") {
    res.status(200).json({ message: completion.data.choices[0].text });
  } else {
    res.status(500).json({ message: "AI error" });
  }
}