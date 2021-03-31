import * as admin from 'firebase-admin'
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { getSystemPreferences } from "./GetSystemPreferences"
import { getPointTypeById } from "./GetPointTypeById"
import { addPoints } from "./AddPoints"
import { submitPointLogMessage } from './SubmitPointLogMessage'
import { PointLogMessage } from '../models/PointLogMessage'
import { User } from '../models/User'

/**
 * Checks permissions and submits points to database
 * 
 * @param user		The user for whom this point is being submit
 * @param log 		Contains information about the point log
 * @param preapprove Is the log preapproved
 * @param documentId (optional) does this point log have an id already - ex. single use QR codes
 * @param overrideResidentsCanSubmit (optional) overrides the point type's canResidentsSubmitField
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
export async function submitPoint(user: User, log: UnsubmittedPointLog, preapproved: boolean, documentId?: string | null, overrideResidentsCanSubmit:boolean = false): Promise<Boolean>{
	const db = admin.firestore()
	const systemPreferences = await getSystemPreferences()
	if (systemPreferences.isCompetitionEnabled) {
		const pointType = await getPointTypeById(log.pointTypeId)
		if(pointType.enabled && ( overrideResidentsCanSubmit || pointType.residentsCanSubmit)){
			if(user.isParticipantInCompetition()){
				log.updateFieldsWithUser(user)
				log.updateFieldsWithPointType(pointType)

				if(preapproved){
					//If the log is approved
					log.approveLog()
				}
				else {
					//If the point log is not immediately approved, set the pointtypeID to negative
					log.pointTypeId *= -1
					log.rhpNotifications = 1
				}
				try {
					if (documentId && documentId !== "") {
						// If the PointLog has a pre-determined documentId then it means it is a single-use code and should be approved
						log.id = documentId
						
						//If a document ID is provided, check if the id exists, and if not, set in database
						const doc = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house)
													.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).get()
						if (doc.exists) {
							return Promise.reject(APIResponse.PointsAlreadyClaimed())
						}
						else {
							await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house)
								.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).set(log.toFirebaseJSON())
						}

					}
					else {

						console.log("NO ID")
						//No document id, so create new document in database
						const document = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house)
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

				await db.runTransaction(async (transaction) => {
					//Get the Hosue Point Type Submission Counts
					const housePointTypeSubmissionCountsDocumentReference = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC)
					const housePointTypeSubmissionCounts = await transaction.get(housePointTypeSubmissionCountsDocumentReference)

					if(housePointTypeSubmissionCounts.exists){

						//Check if Point Type already exists on the submission count doc
						if(pointType.id in housePointTypeSubmissionCounts.data()!){
							console.log("id exists exist in: "+JSON.stringify(housePointTypeSubmissionCounts.data()!))

							//Update the data
							const pointTypeData = housePointTypeSubmissionCounts.data()![pointType.id]
							pointTypeData.submitted += 1

							//Format and post update
							const housePointTypeUpdate = {}
							housePointTypeUpdate[pointType.id] = pointTypeData
							transaction.update(housePointTypeSubmissionCountsDocumentReference, housePointTypeUpdate);
						}
						else{
							console.log("id does not exist")

							//The document does not already exist, so create the format
							const housePointTypeUpdate = {}
							housePointTypeUpdate[pointType.id]= {name: pointType.name, submitted: 1, approved: 0}
							transaction.update(housePointTypeSubmissionCountsDocumentReference, housePointTypeUpdate);
						}
					}
					else{
						console.error("House Point Type Submission Count document must exist")
						throw APIResponse.ServerError()
					}
					
					}
				);

				// const housePointTypeUpdate = {}
				// housePointTypeUpdate[pointType.id] = {submitted:admin.firestore.FieldValue.increment(1)}
				// console.log("MAP: "+JSON.stringify(housePointTypeUpdate))
				// await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC).update(housePointTypeUpdate)
				// console.log("Updated pt")
				// throw APIResponse.Unauthorized()

				//If the log is automatically approved, add points to the user and the house
				if(preapproved){
					await submitPointLogMessage(user.house, log, PointLogMessage.getPreaprovedMessage(), true)
					await addPoints(pointType, user.house, user.id)
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
		else if(!pointType.residentsCanSubmit){
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