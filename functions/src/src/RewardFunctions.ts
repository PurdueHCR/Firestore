import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";
import { Reward } from "../models/Reward";
import { APIResponse } from "../models/APIResponse";
import { House } from "../models/House";

/**
 * Create the following rewards in the database
 * @param rewards Rewards to add
 * @throws 500
 */
export async function setRewards(rewards:Reward[]){
    for (const reward of rewards){
        await createReward(reward)
    }
}

/**
 * Create a new reward. Do not use this function for updating a point type
 * @param reward Rewards to set in database
 */
export async function createReward(reward:Reward){
    //We take the entire model when creating this reward because we know what the id will be at the time of creation, so it can be placed in the reward model.
    const db = admin.firestore()
    await db.collection(HouseCompetition.REWARDS_KEY).doc(reward.id.toString()).set(reward.firestoreJson())
}

/**
 * Takes the fields in reward and saves them to firstore. This assumes that the existence of the reward has already been verified
 * @param reward Reward Model to post Firestore
 */
export async function updateReward(reward:Reward){
    const db = admin.firestore()
    await db.collection(HouseCompetition.REWARDS_KEY).doc(reward.id.toString()).update(reward.firestoreJson())
}

/**
 * Deletes the reward of firstore. This assumes that the existence of the reward has already been verified
 * @param reward Reward Model to delete from Firestore
 */
export async function deleteReward(reward:Reward){
    const db = admin.firestore()
    await db.collection(HouseCompetition.REWARDS_KEY).doc(reward.id.toString()).delete()
}

/**
 * Get a Reward from its Id
 * 
 * @param id The id of the Reward to retrieve
 * 
 * @throws 420 - Unknown Reward
 * @throws 500 - Server  Error
 */
export async function getRewardById(id: string) : Promise<Reward> {
	const db = admin.firestore()
    const rewardDocument = await db.collection(HouseCompetition.REWARDS_KEY).doc(id).get()
    if(!rewardDocument.exists){
        throw APIResponse.UnknownReward()
    }
    else{
        const reward = Reward.fromDocumentSnapshot(rewardDocument)
        return reward
    }
}

/**
 * Get list of all rewards
 * 
 * @throws 500 - ServerError
 */
export async function getAllRewards() : Promise<Reward[]> {
	const db = admin.firestore()
    const rewardQuerySnapshot = await db.collection(HouseCompetition.REWARDS_KEY).orderBy("RequiredPPR","asc").get()
    return Reward.fromQuerySnapshot(rewardQuerySnapshot)
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
	return nextReward

}