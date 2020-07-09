import * as admin from 'firebase-admin'
import { APIResponse } from "../models/APIResponse"
import { PointLog } from '../models/PointLog'
import { HouseCompetition } from "../models/HouseCompetition"
import { getUser } from "./GetUser"
import { UserPermissionLevel } from '../models/UserPermissionLevel'


/**
 * 
 * @param user_id User id of the user making the request. Must be RHP
 * @param limit limit on the number of point logs to retrieve
 */
export async function getUnhandledPointLogs( user_id: string,limit: number = -1) : Promise<PointLog[]> {
    try {
        const db = admin.firestore()
        const user = await getUser(user_id)
        if(user.permissionLevel === UserPermissionLevel.RHP){
            const reference = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).where(PointLog.POINT_TYPE_ID, '<=', 0)
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
        else{
            return Promise.reject(APIResponse.InvalidPermissionLevel())
        }
    }
    catch (err) {
        console.error("GET PointLogs error: " + err)
        return Promise.reject(APIResponse.ServerError())
    }
}