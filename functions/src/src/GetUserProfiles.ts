import { UserPermissionLevel } from "../models/UserPermissionLevel"
import { getSystemPreferences } from "./GetSystemPreferences"
import { getAllHouses } from "./GetHouses"
import { House } from "../models/House"
import { getRank } from "./GetUserRank"
import { getNextRewardForHouse } from "./GetReward"
import { getPointLogsForUser } from "./GetPointLogsForUser"
import { User } from "../models/User"
import { verifyUserHasCorrectPermission } from "./VerifyUserHasCorrectPermission"

/**
 * Gets all information for the overview page if user is resident
 *  *** and temporaryly, rhp and privileged res
 * @param user User for which to get profile
 */
export async function getResidentProfile(user:User): Promise<ResidentProfile>{
	verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.RESIDENT, UserPermissionLevel.PRIVILEGED_RESIDENT])
	const data:any = {}
	const systemPreferences = await getSystemPreferences()
	if(systemPreferences.isCompetitionVisible){
		
		const houses = await getAllHouses()
		let user_house: House = houses[0]
		for(const house of houses){
			if(house.id === user.house){
				user_house = house
				break
			}
		}
		
		data.user_rank = await getRank(user)
		data.next_reward = await getNextRewardForHouse(user_house)
		data.houses = houses
	}
	else{
		data.user_rank = {}
		data.next_reward = {}
		data.houses = []
	}

	data.last_submissions = await getPointLogsForUser(user.id, user.house, 5)

	return data
}

export declare type ResidentProfile = {
    user_house: any[],
    user_rank: any,
    next_reward: any,
    last_submissions: any[]
}