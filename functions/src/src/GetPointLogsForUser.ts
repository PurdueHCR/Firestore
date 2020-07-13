import * as admin from 'firebase-admin'
import { APIResponse } from "../models/APIResponse"
import { PointLog } from '../models/PointLog'
import { HouseCompetition } from "../models/HouseCompetition"
import { User } from '../models/User'


/**
 * Get point logs belonging to the user orderd by the date they were submitted
 * @param userID - Id of user to get point logs for
 * @param house - name of house that user belongs to
 * @param limit - Optional number of point logs to retrieve
 * @throws 500 - ServerError
 */
export async function getPointLogsForUser(user:User, limit: number = -1) : Promise<PointLog[]> {
    try {
        const db = admin.firestore()
        const reference = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).where(PointLog.RESIDENT_ID, '==', user.id)
        const pointLogQuerySnapshot = await reference.get()
        let logs = PointLog.fromQuerySnapshot(pointLogQuerySnapshot)
        logs.sort((a:PointLog, b:PointLog) => {
            return (b.dateOccurred < a.dateOccurred)? -1: 1
        })
        if(limit > 0){
            logs = logs.slice(0,limit)
        }
        return Promise.resolve(logs)
    }
    catch (err) {
        console.error("GET PointLogs error: " + err)
        return Promise.reject(APIResponse.ServerError())
    }
}