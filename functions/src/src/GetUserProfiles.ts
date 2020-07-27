import { UserPermissionLevel } from "../models/UserPermissionLevel"
import { getSystemPreferences } from "./GetSystemPreferences"
import { getAllHouses } from "./GetHouses"
import { House } from "../models/House"
import { getRank } from "./GetUserRank"
import { getNextRewardForHouse } from "./RewardFunctions"
import { getPointLogsForUser } from "./GetPointLogsForUser"
import { User } from "../models/User"
import { verifyUserHasCorrectPermission } from "./VerifyUserHasCorrectPermission"
import { getViewableHouseCodes } from "./GetHouseCodes"

/**
 * Gets all information for the overview page if user is resident
 *  *** and temporaryly, rhp and privileged res
 * @param user User for which to get profile
 * @throws 403 - Invalid permissions
 * @throws 500 - Server Error
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

	data.last_submissions = await getPointLogsForUser(user, 5)

	return data
}

export declare type ResidentProfile = {
    user_house: any[],
    user_rank: any,
    next_reward: any,
    last_submissions: any[]
}

/**
 * Gets all information for the overview page if user is resident
 *  *** and temporaryly, rhp and privileged res
 * @param user User for which to get profile
 * @throws 403 - Invalid permissions
 * @throws 500 - Server Error
 */
export async function getRHPProfile(user:User): Promise<RHPProfile>{
	verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP])
	const data:RHPProfile = {}
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

	data.house_codes = await getViewableHouseCodes(user)
	data.last_submissions = await getPointLogsForUser(user, 5)

	return data
}

export declare type RHPProfile = {
    user_house?: any,
    user_rank?: any,
    next_reward?: any,
	last_submissions?: any[],
	house_codes?: any[],
	houses?: any[]
}