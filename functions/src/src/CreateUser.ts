import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { getUser } from './GetUser'
import { getHouseCodes } from './GetHouseCodes'

/**
 * 
 * @param user_id    Id of the user create
 * @param code       Code to create user
 * @param first_name Preferred first name of the user
 * @param last_name  Preferred last name of the user
 * @returns          APIResponse
 * 
 * @throws 	410 - HouseCodeDoesNotExist
 * @throws 	412 - UserAlreadyExists
 * @throws 	500 - ServerError
 */
export async function createUser(user_id: string, code: string, first_name: string, last_name: string): Promise<APIResponse> {
    try {
        await getUser(user_id)
        //User already exists, so we do not want to overwrite it
        const error = APIResponse.UserAlreadyExists()
        return Promise.reject(error)
    }
    catch(error){
        //Error means that the user does not already exist

        if(error instanceof APIResponse && error.code === 421){
            //Error code 421 means user does not exist

            const houseCodes = await getHouseCodes()
            for( const houseCode of houseCodes){
                if(houseCode.code === code){
                    const user = User.fromCode(first_name,  last_name, user_id, houseCode)
                    await createUserFromModel(user_id, user)
                    const success = APIResponse.Success()
                    return Promise.resolve(success)
                }
            }
            const apiResponse = APIResponse.HouseCodeDoesNotExist()
            return Promise.reject(apiResponse)
        }
        else if (error instanceof APIResponse){
            return Promise.reject(error)
        }
        else {
            console.log("FAILED WITH DB FROM user ERROR: "+ error)
            const apiResponse = APIResponse.ServerError()
            return Promise.reject(apiResponse)
        }
    }
}

/**
 * Create a user in the database and add to house user rank if applicable
 * 
 * @param user_id   id of the user to created
 * @param user      User data to be set in the database
 * @throws           ServerError
 */
export async function createUserFromModel(user_id: string, user:User): Promise<void> {
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.USERS_KEY).doc(user_id).set(user.toFirestoreJson())
        if(user.isParticipantInCompetition()){
            const userHouseRank = user.getHouseRankModel()
            await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).update(userHouseRank)
        }
        return Promise.resolve()
    }
    catch (error){
        console.log("SERVER ERROR on create user: "+error)
        const apiResponse = APIResponse.ServerError()
        return Promise.reject(apiResponse)
    }
}

