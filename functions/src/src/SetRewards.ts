import { APIResponse } from "../models/APIResponse";
import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";
import { Reward } from "../models/Reward";

/**
 * Create the following rewards in the database
 * @param rewards Rewards to add
 * @throws 500
 */
export async function setRewards(rewards:Reward[]){
    for (const reward of rewards){
        await setReward(reward)
    }
}

/**
 * Set a new reward. Do not use this function for updating a point type
 * @param reward Rewards to set in database
 * @throws 500
 */
export async function setReward(reward:Reward){
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.REWARDS_KEY).doc(reward.id.toString()).set(reward.firestoreJson())
    }
    catch (err) {
        console.error("Error setting reward. " + err)
		throw APIResponse.ServerError()
    }
}