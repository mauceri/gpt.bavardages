//import "server-only";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MDBRes } from "@/lib/OpenAIAPIKey";
import getOpenAIAPIKey from "@/lib/OpenAIAPIKey";
import { toChatML, get_message } from "gpt-to-chatgpt";
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

  console.log("prompt = ", req.body.prompt);
  console.log("model = ", req.body.model);
  console.log("model = ", mdbres.oaik);

  let config = {
    "model": 'post',
    //"maxBodyLength": Infinity,
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + mdbres?.oaik
    },
    "data": JSON.stringify({
      "model": 'gpt-3.5-turbo',
      "messages":[{"content":req.body.prompt,"role":"user"}],
      "temperature":0
    })
  }

  const client = axios.create({
    headers: {
      Authorization: "Bearer " + mdbres?.oaik,
    },
  });
  const params = {
    "model": 'gpt-3.5-turbo',
    "messages":[{"content":req.body.prompt,"role":"user"}],
    max_tokens: 1000,
    temperature: 0,
  };
  console.log(params);
  client
  .post("https://api.openai.com/v1/chat/completions", params)
  .then((response: any) => {
    console.log("******************",response.data.choices[0].message);
    let data = response.data;
    res.status(200).json({ message: data.choices[0] });
  }).catch((err: any) => {
    console.log("Message d'erreur OpenAI", err.message);
    res.status(400).json(err);
  });
}

  /*
  await axios(config)
    .then((response: any) => {
      console.log((get_message(response.data)));
      let data = response.data;
      res.status(200).json({ message: data.choices[0].text });
    }).catch((err: any) => {
      console.log("Message d'erreur OpenAI", err.message);
      res.status(400).json(err);
    });
    */