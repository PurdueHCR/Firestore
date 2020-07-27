import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { House } from '../models/House'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'
import { PointType } from '../models/PointType'

/**
 * Increment points for the house and the user (if provided) in the database
 * 
 * @param points		Number of points to add to the house and user
 * @param house_name 	Name of the house that gets the points
 * @param user_id 		(optional) id of the user who gets the points
 * @param increment		bool for should increment or decrement points
 * 
 * @throws 500 - Server Error
 */
export async function addPoints(pointType: PointType, house_name: string, user_id?: string, increment: boolean = true): Promise<void> {
	//This function takes the ids for the house and the user as parameters because we need to run a transaction 
	//to retrive the updated values for their total points. A transaction is a block of database update commands
    //which are required to run sequentially without interrupts from other transactions. This prevents race conditions.
    
    const db = admin.firestore()

	// Ensure points is an integer
	const rounded_points = Math.floor(pointType.value) * ((increment) ? 1 : -1)

	try {
		await db.runTransaction(async (transaction) => {
			//Get the current house
			const houseSnapshot = await transaction.get(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name))
			const house = House.fromDocumentSnapshot(houseSnapshot)

			const housePointTypesSnapshot = await transaction.get(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC))
			if(!housePointTypesSnapshot.exists){
				console.error("There is no House/Detials/PointType document. Please make sure that one exists")
				throw APIResponse.ServerError()
			}

			//If a user id was provided,
			if(user_id && user_id !== ""){
				//Get the user
				const user = User.fromDocumentSnapshot((await transaction.get(db.collection(HouseCompetition.USERS_KEY).doc(user_id))))

				//get the house user rank data
				const rankArraySnapshot = await transaction.get(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC))
				
				//Update the user model and post update
				user.totalPoints += rounded_points
				user.semesterPoints += rounded_points
				transaction.update(db.collection(HouseCompetition.USERS_KEY).doc(user_id), user.toPointUpdateJson())
				
				//Update the House User Rank model
				let userRankDoc = rankArraySnapshot.data()![user_id]
				if(userRankDoc === undefined){
					userRankDoc = {
						firstName: user.firstName,
						lastName: user.lastName,
						totalPoints: user.totalPoints,
						semesterPoints: user.semesterPoints
					}
				}
				else{
					userRankDoc.totalPoints = user.totalPoints
					userRankDoc.semesterPoints = user.semesterPoints
				}
				

				//Create format for update and post update
				const userRankUpdateData = {}
				userRankUpdateData[user_id] = userRankDoc
				transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC), userRankUpdateData)
			}


			// Update the House Point Type Submission List
			const housePointTypeData = housePointTypesSnapshot.data()!
			if(!(pointType.id in housePointTypeData)){
				console.error("The point type id does not exist in the House/Details/PointTypes document. It should at this point exist because submitting a point adds it to the document if it doesnt already exist. If this is a test, make sure you call FirestoreDataFactory.setHousePointTypeDetails")
				throw APIResponse.ServerError()
			}

			//Increment the approved count for this point type by 1
			housePointTypeData[pointType.id].approved += 1 * ((increment) ? 1 : -1)

			const housePointTypeUpdate = {}
			housePointTypeUpdate[pointType.id] = housePointTypeData[pointType.id]
				
			transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC),housePointTypeUpdate )
			

			//Add points to the house and update in database
			house.totalPoints  += rounded_points
			transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name), house.toPointUpdateJson())


		})
		//Resolve the promise
		return Promise.resolve()
	}
	catch(error){
		if(error instanceof APIResponse){
			return Promise.reject(error)
		}
		else{
			console.error(error)
			const apiError = APIResponse.ServerError()
			return Promise.reject(apiError)
		}
		
	}
	
}