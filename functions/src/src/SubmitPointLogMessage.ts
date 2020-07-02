import * as admin from "firebase-admin"
import { PointLog } from "../models/PointLog"
import { PointLogMessage } from "../models/PointLogMessage"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"

/**
 * Saves the point log message to the database
 * 
 * @param house             Name of the house where the pointlog is saved
 * @param pointLog          Pointlog that has the message. (Only the id is needed)
 * @param message           Message to save
 * @param send_to_resident  True if sending to resident, false if sending to RHP
 * 
 * @throws 500 - Server Error
 */
export async function submitPointLogMessage(house: string, pointLog: PointLog, message: PointLogMessage, send_to_resident: boolean): Promise<void>{
    const db = admin.firestore()

    try {
        let log_reference = db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY)
        .doc(pointLog.id)
        await log_reference.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_COLLECTION_MESSAGES_KEY).add(message.toJson())
        if (send_to_resident) {
            await log_reference.update({ResidentNotifications:1})
        } else {
            await log_reference.update({RHPNotifications:1})
        }
        return Promise.resolve()
    } catch (error) {
        console.log("Error getting System Preferences. " + error)
        return Promise.reject(new APIResponse(500, "Server Error"))
    }

    // return db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY)
    // .doc(pointLog.id).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_COLLECTION_MESSAGES_KEY).add(message.toJson()).then( _ => {
    //     return Promise.resolve()
    // })
    // .catch((error) =>{
    //     console.log("Error getting System Preferences. " + error)
    //     return Promise.reject(new APIResponse(500, "Server Error"))
    // })

}