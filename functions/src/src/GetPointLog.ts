import * as admin from 'firebase-admin'
import { APIResponse } from "../models/APIResponse"
import { PointLog } from '../models/PointLog'
import { HouseCompetition } from "../models/HouseCompetition"
import { User } from '../models/User'
import { UserPermissionLevel } from '../models/UserPermissionLevel'


/**
 * Get a point log
 * @param user - User model for owner of the log
 * @param log_id - log id to return
 * @throws 403 - Invalid Permission Level
 * @throws 413 - Unknown Point Log
 * @throws 431 - Can not access Point Log
 */
export async function getPointLog(user: User, log_id) : Promise<PointLog> {
    const db = admin.firestore()
    const reference = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(log_id)
    const pointLogSnapshot= await reference.get()
    if (!pointLogSnapshot.exists) {
        // PointLog could not be found
        return Promise.reject(APIResponse.UnknownPointLog())
    }
    const log = PointLog.fromDocumentSnapshot(pointLogSnapshot)
    if(user.permissionLevel === UserPermissionLevel.RHP || user.id === log.residentId){
        return Promise.resolve(log)
    }
    else{
        console.log("CAN NOT ACCESS POINT LOG")
        return Promise.reject(APIResponse.CanNotAccessPointLog())
    }
}