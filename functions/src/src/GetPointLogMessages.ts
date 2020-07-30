import * as admin from 'firebase-admin'
import { PointLogMessage } from "../models/PointLogMessage"
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'

/**
 * Get messages for a point log
 * @throws 400 User doesnt exist
 * @throws 403 Invalid Permission Level
 * @throws 413 unknown point log
 * @throws 500 Server error
 */
export async function getPointLogMessages(house:string, log_id:string) : Promise<PointLogMessage[]> {
    const db = admin.firestore()
    try{
        const messagesQuerySnapshot = await db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(log_id).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_COLLECTION_MESSAGES_KEY).orderBy("CreationDate", "asc").get()
        const messages = PointLogMessage.fromQuerySnapshot(messagesQuerySnapshot)
        return Promise.resolve(messages)
    }
    catch(error){
        console.log("Failed to get PointLog message with error: "+error)
        return Promise.reject(APIResponse.ServerError())
    }
}