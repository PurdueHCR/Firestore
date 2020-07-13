import { SystemPreference } from "../models/SystemPreference"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import * as admin from 'firebase-admin'

/**
 * Get the system preferences
 * @throws 500 - Server Error 
 */
export async function getSystemPreferences() : Promise<SystemPreference>{
	const db = admin.firestore()
	try {
		const preferencesDoc = await db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).doc(HouseCompetition.SYSTEM_PREFERENCES_DOCUMENT_KEY).get()
		const systemPreferences = SystemPreference.fromDocument(preferencesDoc)
		return Promise.resolve(systemPreferences)
	}
	catch (err) {
		console.error("Error getting System Preferences. " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}