import { NextApiResponse } from "next";
import { connectToDatabase } from "./mongodb";


export type MDBRes = {
    oaik: string;
    message: string;
  }

  export function handleGetOpenAIKR(mdbres:MDBRes,res:NextApiResponse)
  {
    if (mdbres?.oaik === "") {
      res.status(500).json({ message: "OpenAI API key missing" });
      return false;
    } else if (mdbres?.message === "Update OK") {
      res.status(200).json({ message: "Update OK" });
      return false;
    }
    return true;
  }

  export function handleOpenAIR(completion:any,res:NextApiResponse)
  {
    if (completion?.statusText === "OK") {
      res.status(200).json({ message: completion.data.choices[0].text });
    } else {
      res.status(500).json({ message: "AI error" });
    }
}
  const getOpenAIAPIKey = async (message: string, apiKeyMissing: boolean, user: string) => {
    let res:MDBRes = { "oaik": "", "message": "" };
    //console.log(message,apiKeyMissing,user);
    if (apiKeyMissing) { 
      //User gave a new key in message
      try {
        const { database } = await connectToDatabase('bavardages') as any;
        await database
          .collection("utilisateurs")
          .updateOne({ "id": user }, { $set: { "OpenAIAPIKey": message } }, { upsert: true })
          ;
        res.oaik = message;
        res.message = "Update OK";
      } catch (e) {
        res = { "oaik": "", "message": "Update failed" };
      }
      return res;
    } else {
      //First attempt
      try {
        //console.log("User: ",user);
        const { database } = await connectToDatabase('bavardages') as any;
        const result = await database
          .collection("utilisateurs")
          .findOne({ 'id': user })
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

  export default getOpenAIAPIKey;