//import "server-only";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MDBRes, handleGetOpenAIKR, handleOpenAIR } from "@/lib/OpenAIAPIKey";
import getOpenAIAPIKey from "@/lib/OpenAIAPIKey";
import axios from "axios";

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
    const param = {
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": req.body.prompt }],
        "temperature": 0,

    }
    const client = axios.create({
      headers: {
        Authorization: "Bearer " + mdbres.oaik,
      },
    });

    //console.log(param);
    client
      .post("https://api.openai.com/v1/chat/completions", param)
      .then((result) => { 
        res.status(200).json(result.data.choices[0].message ) })
      .catch((err) => { console.log("Erreur ", err.message); res.status(500).json(err.message); })
  } else {
    res.status(400).json("Unknown error");
  }
}
