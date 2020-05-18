import * as admin from 'firebase-admin'
import { Reward } from "../models/Reward"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { House } from '../models/House'

/**
 * Get a Reward from its Id
 * 
 * @param id The id of the Reward to retrieve
 * 
 * @throws 420 - Unknown Reward
 * @throws 500 - Server  Error
 */
export async function getRewardById(id: string) : Promise<Reward> {
	try {
        const db = admin.firestore()
		const rewardDocument = await db.collection(HouseCompetition.REWARDS_KEY).doc(id).get()
		if(!rewardDocument.exists){
			return Promise.reject(APIResponse.UnknownReward())
		}
		else{
			const reward = Reward.fromDocumentSnapshot(rewardDocument)
			return Promise.resolve(reward)
		}
	}
	catch (err) {
		console.log("GET Reward Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}

/**
 * Get list of all rewards
 * 
 * @throws 500 - ServerError
 */
export async function getAllRewards() : Promise<Reward[]> {
	try {
        const db = admin.firestore()
		const rewardQuerySnapshot = await db.collection(HouseCompetition.REWARDS_KEY).orderBy("RequiredPPR","asc").get()
        return Promise.resolve(Reward.fromQuerySnapshot(rewardQuerySnapshot))
	}
	catch (err) {
		console.log("GET Reward Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}

/**
 * Get the next reward for the given house. Will return the highest reward if there is none
 * @param house House to get next reward for
 * @throws 500 - ServerError
 */
export async function getNextRewardForHouse(house: House): Promise<Reward> {
	const rewards = await getAllRewards()
	let nextReward = rewards[rewards.length - 1]
	for(const reward of rewards){
		if(reward.requiredPPR > house.pointsPerResident){
			nextReward = reward
			break
		}
	}
	return Promise.resolve(nextReward)

}