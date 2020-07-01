import * as admin from 'firebase-admin'
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { UserPermissionLevel } from "../models/UserPermissionLevel"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { getSystemPreferences } from "./GetSystemPreferences"
import { getPointTypeById } from "./GetPointTypeById"
import { addPoints } from "./AddPoints"
import { getUser } from "./GetUser"
import { submitPointLogMessage } from './SubmitPointLogMessage'
import { PointLogMessage } from '../models/PointLogMessage'

/**
 * Checks permissions and submits points to database
 * 
 * @param userId	The id of the user for whom this point is being submit
 * @param log 		Contains information about the point log
 * @param isGuaranteedApproval Is this a log which does not need an RHP to approve it
 * @param documentId (optional) does this point log have an id already - ex. single use QR codes
 * @returns True if the points were added, false if needs approval
 * 
 * @throws 403 - This User does not have the correct permission levels.
 * @throws 409 - This Link Has Already Been Submitted
 * @throws 412 - House Competition Is Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 419 - Users Can Not Self Submit This Point Type
 * @throws 500 - Server Error
 */
export async function submitPoint(userId: string, log: UnsubmittedPointLog, documentId?: string | null): Promise<Boolean>{

	const db = admin.firestore()
	const systemPreferences = await getSystemPreferences()
	if (systemPreferences.isHouseEnabled) {
		const pointType = await getPointTypeById(log.pointTypeId)
		if(pointType.enabled && pointType.residentCanSubmit){
			const user = await getUser(userId)
			if(user.isParticipantInCompetition()){
				log.updateFieldsWithUser(user)

				var was_approved = false
				if(user.permissionLevel === UserPermissionLevel.RHP){
					//If the log is approved
					log.approveLog()
					was_approved = true
				}
				else {
					//If the point log is not immediately approved, set the pointtypeID to negative
					log.pointTypeId *= -1
				}
				try {
					if (documentId && documentId !== "") {
						//If a document ID is provided, check if the id exists, and if not, set in database
						const doc = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house.toString())
													.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).get()
						if (doc.exists) {
							return Promise.reject(APIResponse.LinkAlreadySubmitted())
						}
						else {
							await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house.toString())
								.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).set(log.toFirebaseJSON())
						}
						// If the PointLog has a pre-determined documentId then it means it is a single-use code and should be approved
						log.approveLog()
						log.id = documentId
						was_approved = true
					}
					else {
						//No document id, so create new document in database
						const document = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house.toString())
													.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).add(log.toFirebaseJSON())
						log.id = document.id
					}

				}
				catch (error) {
					if(error instanceof APIResponse){
						return Promise.reject(error)
					}
					console.error("Error From Writing PointLog. " + error)
					return Promise.reject(new APIResponse(500, "Server Error"))
				}

				//If the log is automatically approved, add points to the user and the house
				if(was_approved){
					await submitPointLogMessage(user.house, log, PointLogMessage.getPreaprovedMessage())
					await addPoints(pointType.value, user.house, user.id)
					return Promise.resolve(true)
				}
				else {
					return Promise.resolve(false)
				}
					
				
			}
			else {
				return Promise.reject(APIResponse.InvalidPermissionLevel())
			}
		}
		else if(!pointType.residentCanSubmit){
			return Promise.reject(APIResponse.PointTypeSelfSubmissionDisabled())
		}
		else {
			return Promise.reject(APIResponse.PointTypeDisabled())
		}

	}
	else {
		return Promise.reject(APIResponse.CompetitionDisabled())
	}
}