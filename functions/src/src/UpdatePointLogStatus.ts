import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { getUser } from './GetUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { submitPointLogMessage } from './SubmitPointLogMessage'
import { PointLogMessage } from '../models/PointLogMessage'
import { addPoints } from './AddPoints'
import { PointLog } from '../models/PointLog'
import { MessageType } from '../models/MessageType'

const REJECTED_STRING = "DENIED: "

/**
 * 
 * @param user_id       ID of user updating the point
 * @param document_id   ID of PointLog to approve/reject
 * @param approve       Boolean to approve/reject the PointLog   
 * 
 * @throws  403 - InvalidPermissionLevel
 * @throws  413 - UnknownPointLog
 */
export async function updatePointLogStatus(user_id: string, document_id: string, approve: boolean): Promise<void> {
    
    const user = await getUser(user_id)
    if (user.permissionLevel != UserPermissionLevel.RHP) {
        return Promise.reject(APIResponse.InvalidPermissionLevel)
    }
    const db = admin.firestore()
    try {
        const doc = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house.toString())
                        .collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(document_id).get()
        if (!doc.exists) {
            // PointLog could not be found
            return Promise.reject(APIResponse.UnknownPointLog)
        } else {

            let log = PointLog.fromDocumentSnapshot(doc)
            let resident_id = (await getUser(log.residentId)).id

            let already_handled = true
            if (log.pointTypeId < 0) {
                // Log hasn't been handled before.
                already_handled = false
                log.pointTypeId *= -1
            }
            const point_type_doc = await db.collection(HouseCompetition.POINT_TYPES_KEY)
                                    .doc(PointLog.POINT_TYPE_ID).get()
            const point_value = point_type_doc["Value"]
            // Warning: this may not be the correct value
            console.log("Point value is:", point_value)

            // var message_end = " the point request."
            // var message_beginning = user.firstName + " " + user.lastName

            // WARNING: I'M NOT CONVINCED THIS WILL ACTUALLY UPDATE THE LOG DESCRIPTION

            // If reject check to know if need to subtract points
            if (!approve) {
                if (log.description.includes(REJECTED_STRING)) {
                    let response = APIResponse.PointLogAlreadyHandled()
                    return Promise.reject(response)
                } else {
                    log.description = REJECTED_STRING + log.description
                    log.approveLog(user)
                    if (already_handled) {
                        // Log has previously been approved so it is safe to subtract points
                        await addPoints(-1*point_value, user.house, resident_id)
                    }
                    // message_beginning += " rejected" + message_end
                    let messageObj = new PointLogMessage(new Date(), "", MessageType.APPROVE, "first_name", "last_name", UserPermissionLevel.EXTERNAL_ADVISOR)
                    await submitPointLogMessage(user.house, log, messageObj)
                }
            } else {
                if (log.description.includes(REJECTED_STRING) || !already_handled) {
                    // Either log was previously rejected and points must be added back
                    // or log has never been added and points need to be added
                    if (log.description.includes(REJECTED_STRING)) {
                        log.description.slice(0, REJECTED_STRING.length)                    
                    }
                    log.approveLog(user)
                    await addPoints(point_value, user.house, resident_id)
                    // Add message of approval/rejection
                    // message_beginning += " approved" + message_end
                    let messageObj = new PointLogMessage(new Date(), "", MessageType.APPROVE, "first_name", "last_name", UserPermissionLevel.EXTERNAL_ADVISOR)
                    await submitPointLogMessage(user.house, log, messageObj)
                } else {
                    // Log has already been approved so points should not be added
                    let response = APIResponse.PointLogAlreadyHandled()
                    return Promise.reject(response)
                }
            }
            return Promise.resolve()
        }
    }
    catch (error) {
        if (error instanceof APIResponse) {
            return Promise.reject(error)
        } else {
            console.error(error)
            const apiError = APIResponse.ServerError()
            return Promise.reject(apiError)
        }
    }
}