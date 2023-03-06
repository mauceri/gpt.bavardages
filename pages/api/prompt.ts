//import "server-only";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MDBRes } from "@/lib/OpenAIAPIKey";
import getOpenAIAPIKey from "@/lib/OpenAIAPIKey";

var mdbres: MDBRes | null = null;
var userId: any = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (userId != null && userId != req.body.user.id) {
    console.log("Alerte %s est un espion", req.body.user.id);
    res.status(500).json({ message: "OpenAI API key missing" });
    mdbres = null;
  }
  if (mdbres === null) {
    console.log("mdbres = null");
    mdbres = await getOpenAIAPIKey(req.body.message, req.body.APIKeyMissing, req.body.user.id);
    console.log(mdbres?.message);
  }
  if (mdbres?.oaik === "") {
    res.status(500).json({ message: "OpenAI API key missing" });
    mdbres = null;
    return;
  } else if (mdbres?.message === "Update OK") {
    res.status(200).json({ message: "Update OK" });
    mdbres = null;
    return;
  }
  userId = req.body.user?.id;
  const configuration = new Configuration({
    apiKey: mdbres?.oaik,
  });
  const openai = new OpenAIApi(configuration);
  console.log("prompt = ", req.body.prompt);
  console.log("model = ", req.body.model);
  let completion = null;
  try {
    completion = await openai.createCompletion({
      model: req.body.model,
      prompt:
        req.body.prompt +
        "\nIA: ",
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [req.body.user?.firstName, "IA: "],
    });
    if (completion?.statusText === "OK") {
      for (let i = 0; i < completion.data.choices.length; i++) {
        console.log(completion.data.choices[i]);
      }
      res.status(200).json({ message: completion.data.choices[0].text });
    } else {
      res.status(500).json({ message: "AI error" });
    }
  } catch (err: any) {
    console.log("Message d'erreur OpenAI", err.message);
    res.status(401).json(err);
  }
}