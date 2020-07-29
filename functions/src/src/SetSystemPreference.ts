import { SystemPreference } from "../models/SystemPreference"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import * as admin from 'firebase-admin'

/**
 * Update the system preferences
 * @throws 500 - Server Error 
 */
export async function updateSystemPreferences(systemPreference: SystemPreference) : Promise<void>{
	const db = admin.firestore()
	try {
		await db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).doc(HouseCompetition.SYSTEM_PREFERENCES_DOCUMENT_KEY).update(systemPreference.updateFirebaseJson())

	}
	catch (err) {
		console.error("Error getting System Preferences. " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}

/**
 * Sets the entire model. Do not use this if you are updating
 * @throws 500 - Server Error 
 */
export async function setSystemPreferences(systemPreference: SystemPreference) : Promise<void>{
	const db = admin.firestore()
	try {
		await db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).doc(HouseCompetition.SYSTEM_PREFERENCES_DOCUMENT_KEY).set(systemPreference.firebaseJson())

	}
	catch (err) {
		console.error("Error getting System Preferences. " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}
