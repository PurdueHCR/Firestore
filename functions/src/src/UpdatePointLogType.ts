import admin = require("firebase-admin")
import { APIResponse } from "../models/APIResponse"
import { HouseCompetition } from "../models/HouseCompetition"
import { PointLog } from "../models/PointLog"
import { PointType } from "../models/PointType"
import { addPoints } from "./AddPoints"

const REJECTED_STRING = "DENIED: "


/**
 * Update the pointTypeId for a point log
 * 
 * @param newPointType the new point type for the point log
 * @param documentId the id of the point log to update
 * @param house the user's house
 */

export async function updatePointLogType(newPointTypeId: number, documentId: string, house: string) {

    // Update value in point log
    const db = admin.firestore()
    const doc_ref = db.collection(HouseCompetition.HOUSE_KEY).doc(house)
        .collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId)
        const doc = await doc_ref.get()
        if (!doc.exists) {
            // PointLog could not be found
            throw APIResponse.UnknownPointLog()
        } else {

            const log = PointLog.fromDocumentSnapshot(doc)
            let residentId = log.residentId

            const oldPointTypeDoc = await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(log.pointTypeId.toString()).get()
            const oldPointType = PointType.fromDocumentSnapshot(oldPointTypeDoc)
            const newPointTypeDoc = await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(newPointTypeId.toString()).get()
            const newPointType = PointType.fromDocumentSnapshot(newPointTypeDoc)

            // If was already approved, then update house and user points
            let already_handled = true
            if (log.pointTypeId < 0) {
                // Log hasn't been handled before.
                already_handled = false
            }
            if (already_handled && !log.description.includes(REJECTED_STRING)) {
                // Log is currently approved so we may need to update the user and house points

                // Remove old points
                await addPoints(oldPointType, house, residentId, false)
                // Add new points
                await addPoints(newPointType, house, residentId)
            }

            // Update the point type id on the log
            log.updatePointTypeId(newPointTypeId)

            await doc_ref.set(log.toFirebaseJSON())
        }


}