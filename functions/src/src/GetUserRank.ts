import { UserRank } from '../models/UserRank'
import { getUser } from './GetUser'
import { getUsersFromHouse } from './GetUsersFromHouse'
import { User } from '../models/User'

/**
 * Get the UserRank for a userId
 * 
 * @param user_id Database id of the user to retrieve Rank for
 * @throws 400 - NonExistantUser
 * @throws 401 - Unauthroized
 * @throws 500 - ServerError
 */
export async function getUserRank(user_id: string): Promise<UserRank> {

    const user = await getUser(user_id)
    const houseUsers = await getUsersFromHouse(user.house)

    houseUsers.sort((a:User, b:User) => {
        return b.totalPoints - a.totalPoints
    })
    let houseRank = 1
    while(houseRank <= houseUsers.length && houseUsers[houseRank-1].totalPoints !== user.totalPoints){
        houseRank ++
    }

    houseUsers.sort((a:User, b:User) => {
        return b.semesterPoints - a.semesterPoints
    })

    let semesterRank = 1
    while(semesterRank <= houseUsers.length && houseUsers[semesterRank-1].semesterPoints >= user.semesterPoints){
        semesterRank ++
    }
    return Promise.resolve(new UserRank(houseRank, semesterRank))
}