import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { House } from '../models/House'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'
import { PointType } from '../models/PointType'
import { RankArray } from '../models/RankArray'

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
			

			//If a user id was provided, get the user
			let user: User | null = null
			if(user_id && user_id !== ""){
				const userDocument = await transaction.get(db.collection(HouseCompetition.USERS_KEY).doc(user_id))
				user = User.fromDocumentSnapshot(userDocument)
				const rankArraySnapshot = await transaction.get(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC))
				if(rankArraySnapshot.exists){
					const rankArray = RankArray.fromDocumentSnapshot(rankArraySnapshot)
					rankArray.incrementUser(user,rounded_points)
					transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC), rankArray.toFirestoreJson())
				}
				else{
					const rankArray = new RankArray([])
					rankArray.incrementUser(user,rounded_points)
					console.log("Rank Array: "+JSON.stringify(rankArray.toFirestoreJson()))
					transaction.set(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC), rankArray.toFirestoreJson())
				}
			}

			// const housePointTypes = housePointTypesSnapshot.data()!

			// const newPointTypeCount = housePointTypes[pointType.id].approved + 1

			if(housePointTypesSnapshot.exists){
				const housePointTypeUpdate = {}
				const housePointTypeData = housePointTypesSnapshot.data()!
				housePointTypeUpdate[pointType.id] = {approved: housePointTypeData[pointType.id].approved + 1}
					
				transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC),housePointTypeUpdate )
			}
			else{
				const housePointTypeUpdate = {}
				housePointTypeUpdate[pointType.id] = {approved: 1}
				transaction.set(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC),housePointTypeUpdate )
			}
			

			//Add points to the house and update in database
			house.totalPoints  += rounded_points
			transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house_name), house.toPointUpdateJson())

			//If user id was provided, add points to user and update in database
			if(user_id && user_id !== "" && user !== null){
				user.totalPoints += rounded_points
				user.semesterPoints += rounded_points
				transaction.update(db.collection(HouseCompetition.USERS_KEY).doc(user_id), user.toPointUpdateJson())
			}

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