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

/**
 * Search for users by their last name
 * @param name Name to search for
 * @param perviousName Last name returned for pagination
 */
export async function searchForUsers(name:string, previousName:string = ""): Promise<User[]>{
	const db = admin.firestore()
	if(name.length == 1){
		let firstLetter = name.charCodeAt(0)
		firstLetter += 1
		let lastLetter = String.fromCharCode(firstLetter)
		const userQuerySnapshot = await db.collection("Users").where("LastName", ">=",name).where("LastName","<",lastLetter).orderBy("LastName", "asc").limit(25).startAfter(previousName).get()
		const users = User.fromQuerySnapshot(userQuerySnapshot)
		return users
	}
	else{
		let firstLetter = name.charCodeAt(name.length - 1)
		firstLetter += 1
		let lastLetter = name.substr(0, name.length - 2) + String.fromCharCode(firstLetter)
		const userQuerySnapshot = await db.collection("Users").where("LastName", ">=",name).where("LastName","<",lastLetter).orderBy("LastName", "asc").limit(25).startAfter(previousName).get()
		const users = User.fromQuerySnapshot(userQuerySnapshot)
		return users
	}
	
	
}