import { UserRank } from '../models/UserRank'
import { getUser } from './GetUser'
import { getUsersFromHouse } from './GetUsersFromHouse'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'

/**
 * Get the UserRank for a userId
 * 
 * @param user_id Database id of the user to retrieve Rank for
 * @throws 403 - Invalid Permission Level
 * @throws 500 - ServerError
 */
export async function getUserRank(user_id: string): Promise<UserRank> {

    const user = await getUser(user_id)
    return getRank(user);
}

/**
 * Get the UserRank for a userId
 * 
 * @param user_id Database id of the user to retrieve Rank for
 * @throws 403 - Invalid Permission Level
 * @throws 500 - ServerError
 */
export async function getRank(user:User): Promise<UserRank> {
    if (!user.isParticipantInCompetition())
        return Promise.reject(APIResponse.InvalidPermissionLevel())
    const houseUsers = await getUsersFromHouse(user.house)

    const houseResidents:User[] = []

    for (const usr of houseUsers){
        if(usr.isParticipantInCompetition()){
            houseResidents.push(usr);
        }
    }

    houseResidents.sort((a:User, b:User) => {
        return b.totalPoints - a.totalPoints
    })
    //Count the number of people before you
    let houseRank = 0
    while(houseRank <= houseResidents.length - 1 && houseResidents[houseRank].totalPoints > user.totalPoints ){
        houseRank ++
    }
    //Add 1 to get the rank (Because there can be no 0)
    houseRank ++

    houseResidents.sort((a:User, b:User) => {
        return b.semesterPoints - a.semesterPoints
    })

    
    let semesterRank = 0
    while(semesterRank <= houseResidents.length - 1 && houseResidents[semesterRank].semesterPoints > user.semesterPoints){
        semesterRank ++
    }
    semesterRank++
    return Promise.resolve(new UserRank(houseRank, semesterRank))
}