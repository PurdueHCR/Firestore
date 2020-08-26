import { UserRank } from '../models/UserRank'
import { User } from '../models/User'
import { APIResponse } from '../models/APIResponse'
import { getRankArray } from './GetRankArray'
import { getHouseByName } from './GetHouses'



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
    const house = await getHouseByName(user.house)
    const rankArray = await getRankArray(house)


    const houseYearlyRank = rankArray.getYearlyRank()
    //Count the number of people before you
    let houseRank = 0
    while(houseRank < houseYearlyRank.length - 1 && houseYearlyRank[houseRank].totalPoints > user.totalPoints ){
        houseRank ++
    }
    //Add 1 to get the rank (Because there can be no 0)
    houseRank ++

    const houseSemesterRanks = rankArray.getSemesterRank()

    
    let semesterRank = 0
    while(semesterRank < houseSemesterRanks.length - 1 && houseSemesterRanks[semesterRank].semesterPoints > user.semesterPoints){
        semesterRank ++
    }
    semesterRank++
    return Promise.resolve(new UserRank(houseRank, semesterRank))
}