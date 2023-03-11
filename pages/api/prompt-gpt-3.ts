//import "server-only";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MDBRes, handleGetOpenAIKR, handleOpenAIR } from "@/lib/OpenAIAPIKey";
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
    mdbres = await getOpenAIAPIKey(req.body.message, req.body.APIKeyMissing, req.body.user.id);
  }

  if (handleGetOpenAIKR(mdbres, res)) {
    userId = req.body.user?.id;
    const configuration = new Configuration({
      apiKey: mdbres?.oaik,
    });
    const openai = new OpenAIApi(configuration);
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
      handleOpenAIR(completion, res);
    } catch (err: any) {
      console.log("Message d'erreur OpenAI", err.message);
      res.status(err.status).json(err);
    }
  } else {
    console.log("Erreur inconnue");
    res.status(400).json("Unknown error");
  }
}
