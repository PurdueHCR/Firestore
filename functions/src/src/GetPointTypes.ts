import * as admin from 'firebase-admin'
import { PointType } from "../models/PointType"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"

/**
 * Get a Point Type from its Id
 * 
 * @param id The id of the PointType to retrieve
 */
export async function getPointTypes() : Promise<PointType[]> {
	try {
        const db = admin.firestore()
		const pointTypeSnapshot = await db.collection(HouseCompetition.POINT_TYPES_KEY).get()
		
		return Promise.resolve(PointType.fromQuerySnapshot(pointTypeSnapshot))
	}
	catch (err) {
		console.log("GET Point type Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}