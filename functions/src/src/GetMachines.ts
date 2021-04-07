import * as admin from 'firebase-admin'
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { Machine } from '../models/Machine'

/**
 * Get the system preferences
 * @throws 500 - Server Error 
 */
export async function getMachines() : Promise<Machine[]> {
	const db = admin.firestore()
	try {
		const machinesDoc = await db.collection(HouseCompetition.SYSTEM_PREFERENCES_KEY).doc(HouseCompetition.MACHINES_DOCUMENT_KEY).get()
		const machines = Machine.fromDocument(machinesDoc)
		return Promise.resolve(machines)
	}
	catch (err) {
		console.error("Error getting machines. " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}
