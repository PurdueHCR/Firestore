import * as admin from 'firebase-admin'
import {getUser} from "./GetUser"
import { PointLogMessage } from "../models/PointLogMessage"
import { getPointLog } from './GetPointLog'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { verifyUserHasCorrectPermission } from './VerifyUserHasCorrectPermission'
import { UserPermissionLevel } from '../models/UserPermissionLevel'


/**
 * Get messages for a point log
 * @throws 400 User doesnt exist
 * @throws 403 Invalid Permission Level
 * @throws 413 unknown point log
 * @throws 500 Server error
 */
export async function getPointLogMessages(user_id:string, log_id:string) : Promise<PointLogMessage[]> {
    const db = admin.firestore()
    const user = await getUser(user_id)
    verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.RESIDENT, UserPermissionLevel.PRIVILEGED_RESIDENT])

    //Makes sure PointLog exists and user has permissions to edit
    await getPointLog(user, log_id)

    try{
        const messagesQuerySnapshot = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(log_id).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_COLLECTION_MESSAGES_KEY).orderBy("CreationDate", "asc").get()
        const messages = PointLogMessage.fromQuerySnapshot(messagesQuerySnapshot)
        return Promise.resolve(messages)
    }
    catch(error){
        console.log("Failed to get PointLog message with error: "+error)
        return Promise.reject(APIResponse.ServerError())
    }
}