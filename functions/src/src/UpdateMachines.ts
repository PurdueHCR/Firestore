import * as admin from 'firebase-admin'
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"

/**
 * Get the system preferences
 * @throws 500 - Server Error 
 */
export async function updateMachines(data:any) {
	const db = admin.firestore()
	try {
		await db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).doc(HouseCompetition.MACHINES_DOCUMENT_KEY).set(data)
	}
	catch (err) {
		throw APIResponse.ServerError()
	}
}
