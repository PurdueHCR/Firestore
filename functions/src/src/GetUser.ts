import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import * as admin from "firebase-admin"

/**
 * Get a user with an id
 * 
 * @param id Database id of the user to retrieve
 * @throws 	400 - NonExistantUser
 * @throws 	500 - ServerError 
 */
export async function getUser(id: string) : Promise<User> {
	const db = admin.firestore()
	try{
		const userDocument = await db.collection(HouseCompetition.USERS_KEY).doc(id).get()
		if (!userDocument.exists) {
			console.error("USER DOESNT EXIST")
			return Promise.reject(APIResponse.NonExistantUser())
		}
		else {
			const user = User.fromDocumentSnapshot(userDocument)
			user.id = id
			return Promise.resolve(user)
		}
	}
	catch (err){
		console.error("GET USER ERROR: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
	
}