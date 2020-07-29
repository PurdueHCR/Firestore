import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'

/**
 * Get all users from a house
 * 
 * @param house_name name of the house
 * @throws 500 - ServerError
 */
export async function getUsersFromHouse(house_name: string) : Promise<User[]> {
	try {
        const db = admin.firestore()
		const users = User.fromQuerySnapshot(await db.collection(HouseCompetition.USERS_KEY).where('House', '==', house_name).get())
        return Promise.resolve(users)
	}
	catch (err) {
		console.log("GET USER from house ERROR: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}