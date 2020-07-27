import * as admin from 'firebase-admin'
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { UserPermissionLevel } from "../models/UserPermissionLevel"
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
export async function submitPoint(user: User, log: UnsubmittedPointLog, documentId?: string | null, overrideResidentsCanSubmit:boolean = false): Promise<Boolean>{
	const db = admin.firestore()
	const systemPreferences = await getSystemPreferences()
	if (systemPreferences.isCompetitionEnabled) {
		// Not sure if this try catch is the best way to check the promise returned from checking the PointType
		try {
			const pointType = await getPointTypeById(log.pointTypeId)
			if(pointType.enabled && ( overrideResidentsCanSubmit || pointType.residentsCanSubmit)){
				if(user.isParticipantInCompetition()){
					log.updateFieldsWithUser(user)
					log.updateFieldsWithPointType(pointType)

					let was_approved = false
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
							// If the PointLog has a pre-determined documentId then it means it is a single-use code and should be approved
							log.approveLog()
							log.id = documentId
							was_approved = true
							console.log("HAS ID")
							
							//If a document ID is provided, check if the id exists, and if not, set in database
							const doc = await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house)
														.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).get()
							if (doc.exists) {
								return Promise.reject(APIResponse.LinkAlreadySubmitted())
							}
							else {
								await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house)
									.collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).doc(documentId).set(log.toFirebaseJSON())
							}

						}
						else {

							console.log("NO ID")
							//No document id, so create new document in database
							if (was_approved === false) {
								log.rhpNotifications++
							}
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

					console.log("Got here")
					await db.runTransaction(async (transaction) => {
						console.log("In transaction")
						const docRef = db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC)
						console.log("In docRef")
						const doc = await transaction.get(docRef)
						if(doc.exists){
							console.log("Doc exits but checking id: "+pointType.id)

							if(pointType.id in doc.data()!){
								console.log("id exists exist in: "+JSON.stringify(doc.data()!))
								const housePointTypeUpdate = {}
								housePointTypeUpdate[pointType.id] = {submitted: doc.data()![pointType.id].submitted + 1}
								console.log("Point Type create")
								transaction.update(docRef, housePointTypeUpdate);
							}
							else{
								console.log("id does exist")
								const housePointTypeUpdate = {}
								housePointTypeUpdate[pointType.id]= {name: pointType.name, submitted: 1, approved: 0}
								console.log("Point Type Update")
								transaction.update(docRef, housePointTypeUpdate);
							}
						}
						else{
							console.log("doc doesnt exist")
							const housePointTypeUpdate = {}
							housePointTypeUpdate[pointType.id]= {name: pointType.name, submitted: 1, approved: 0}
							transaction.set(docRef,housePointTypeUpdate)
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
					if(was_approved){
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
		} catch (error) {
			return Promise.reject(APIResponse.UnknownPointType())
		}

	}
	else {
		return Promise.reject(APIResponse.CompetitionDisabled())
	}
}