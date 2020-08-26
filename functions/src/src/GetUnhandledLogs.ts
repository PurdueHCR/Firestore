import * as admin from 'firebase-admin'
import { APIResponse } from "../models/APIResponse"
import { PointLog } from '../models/PointLog'
import { HouseCompetition } from "../models/HouseCompetition"
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { User } from '../models/User'


/**
 * 
 * @param user user to get unhandled logs for
 * @param limit limit on the number of point logs to retrieve
 */
export async function getUnhandledPointLogs( user: User,limit: number = -1) : Promise<PointLog[]> {
    try {
        const db = admin.firestore()
        if(user.permissionLevel === UserPermissionLevel.RHP){
            const reference = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).where(PointLog.POINT_TYPE_ID, '<=', 0)
            const pointLogQuerySnapshot = await reference.get()
            let logs = PointLog.fromQuerySnapshot(pointLogQuerySnapshot)
            logs.sort((a:PointLog, b:PointLog) => {
                return (b.dateOccurred < a.dateOccurred)? -1: 1
            })
            logs.filter((element, index, array) => {
                return element.floorId === user.floorId
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