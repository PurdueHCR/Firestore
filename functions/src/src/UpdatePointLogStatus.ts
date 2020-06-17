import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { getUser } from './GetUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'

/**
 * 
 * @param user_id       ID of user updating the point
 * @param document_id   ID of PointLog to approve/reject
 * @param approve       Boolean to approve/reject the PointLog   
 * 
 * @throws  403 - InvalidPermissionLevel
 * @throws  413 - UnknownPointLog
 */
export async function updatePointLogStatus(user_id: string, document_id: string, approve: boolean) {
    
    const user = await getUser(user_id)
    if (user.permissionLevel != UserPermissionLevel.RHP) {
        return Promise.reject(APIResponse.InvalidPermissionLevel)
    }
    const db = admin.firestore()
    try {
        const doc = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house.toString())
                        .collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(document_id).get()
        if (!doc.exists) {
            return Promise.reject(APIResponse.UnknownPointLog)
        } else {
            // Update PointTypeID to no longer be negative
            // Update ApprovedBy
            // Update ApprovedOn
            // Update ResidentNotifications
            // Check current implementation for any other updates
            // Return success if document fields updated
        }
    }
}