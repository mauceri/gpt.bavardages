import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { connectToDatabase } from "../../lib/mongodb";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let oaik = null;
  console.log("message %s",req.body.message);
  console.log("api key missing ? %b",req.body.APIKeyMissing);


  if (req.body.APIKeyMissing) {
    console.log("key to set %s", req.body.message);
    try {
      const { database } = await connectToDatabase('bavardages') as any;
      const result = await database
        .collection("utilisateurs")
        .updateOne({ 'id': req.body.user.id }, { $set: { "OpenAIAPIKey": req.body.message } }, { upsert: true })
        ;
      oaik = req.body.message;
    } catch (e) {
      res.status(500).json({ message: "Update failed" });
      return;
    }
    console.log("Key = %s", oaik);
    res.status(200).json({ message: "Update OK" });
  } else {
    try {
      const { database } = await connectToDatabase('bavardages') as any;
      const result = await database
        .collection("utilisateurs")
        .findOne({ 'id': req.body.user.id })
        ;
        console.log(result);
      //console.log("apiKey = %s", result.OPENAI_API_KEY)
      oaik = result.OpenAIAPIKey;
      console.log("Clef retrouvée %s", oaik);
    } catch (e) {
      res.status(500).json({ message: "OpenAI API key missing" });
      return;
    }
  }

  const configuration = new Configuration({
    apiKey: oaik,
  });
  const openai = new OpenAIApi(configuration);
  
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Voici une conversation avec un assistant basé sur une IA. Cet assistant est utile, creatif, malin, et très amical.\n\nHumain: Bonjour, comment allez-vous ?\nIA: Je suis une IA créée par OpenAI. Comment puis-je vous aider ?\nHumain: " +
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