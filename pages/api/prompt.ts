//import "server-only";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { connectToDatabase } from "../../lib/mongodb";


const getOpenAIAPIKey = async (message: string, apiKeyMissing: boolean, user: any) => {
  let res = { "oaik": "", "message": "" };

  if (apiKeyMissing) {
    try {
      const { database } = await connectToDatabase('bavardages') as any;
      const result = await database
        .collection("utilisateurs")
        .updateOne({ "id": user.id }, { $set: { "OpenAIAPIKey": message } }, { upsert: true })
        ;
      res.oaik = message;
      res.message = "Update OK";
    } catch (e) {
      res = { "oaik": "", "message": "Update failed" };
      console.log("Error update ", res);
    }
    return res;
  } else {
    try {
      const { database } = await connectToDatabase('bavardages') as any;
      const result = await database
        .collection("utilisateurs")
        .findOne({ 'id': user.id })
        ;
      if (result === null) {
        res.oaik = "";
        res.message = "User not found";
      } else if(result.OpenAIAPIKey === undefined){
        res.message = "OpenAI API key missing";
        res.oaik = "";
      }else {
        res.oaik = result.OpenAIAPIKey;
        res.message = "OK";
      }
      return res;
    } catch (e) {
      res.oaik = "";
      res.message = "User not found";
      return res;
    }
  }
}

var mdbres:any = null;
var userId:any = null;
var keyCache = [{userId:"",key:""}]


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
 
  if(userId != null && userId != req.body.user.id) {
    console.log("Alerte %s est un espion",req.body.user.id);
    res.status(500).json({ message: "OpenAI API key missing" });
    mdbres = null;
  }
  if (mdbres === null) {
    console.log("mdbres = null");
    mdbres = await getOpenAIAPIKey(req.body.message, req.body.APIKeyMissing, req.body.user);
    console.log(mdbres.message);
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
  keyCache.push({userId:userId,key:mdbres.apiKey});
  const configuration = new Configuration({
    apiKey: mdbres?.oaik,
  });
  const openai = new OpenAIApi(configuration);
  console.log("prompt = ",req.body.prompt)
  let completion = null;
  try {
    completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        req.body.prompt +
        "\nIA: ",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [req.body.user?.firstName, "IA: "],
    });
    if (completion?.statusText === "OK") {
      res.status(200).json({ message: completion.data.choices[0].text });
      //for (let i = 0; i < completion.data.choices.length; i++) {
        //console.log(completion.data.choices[i]);
    //}
    } else {
      res.status(500).json({ message: "AI error" });
    }
  } catch (err:any) {
    //console.log(err);
    res.status(401).json(err);
  }
}