import * as admin from 'firebase-admin'
import { Reward } from "../models/Reward"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"

/**
 * Get list of all rewards
 * 
 * @throws 500 - ServerError
 */
export async function getAllRewards() : Promise<Reward[]> {
	try {
        const db = admin.firestore()
		const rewardQuerySnapshot = await db.collection(HouseCompetition.REWARDS_KEY).get()
        return Promise.resolve(Reward.fromQuerySnapshot(rewardQuerySnapshot))
	}
	catch (err) {
		console.log("GET Reward Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}