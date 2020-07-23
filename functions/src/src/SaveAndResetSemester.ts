import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { User } from "../models/User"
import * as admin from 'firebase-admin'

/**
 * Reset all of the user's semster points
 * @throws 500 - Server Error 
 */
export async function saveAndResetSemester() : Promise<void>{
	const db = admin.firestore()
	try {
        //Get all users with a floor id (this will be residents, rhps, and prib)
        const userQuerySnapshot =  await db.collection(HouseCompetition.USERS_KEY).where(User.FLOOR_ID, ">", "").get()
        const users = User.fromQuerySnapshot(userQuerySnapshot)

        let i = 0
        let batch = db.batch()
        for(const user of users){
            //add an update to the user for the batch job
            const ref = db.collection(HouseCompetition.USERS_KEY).doc(user.id)
            batch.update(ref, user.getSemesterUpdate())
            i ++

            //A batch job can only update 500 objects at a time, so at 499 commit the batch, and create a new one
            if(i === 499){
                await batch.commit()
                batch = db.batch()
            }
        }
        await batch.commit()

    }
	catch (err) {
		console.error("Error Updating Semester points. " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}