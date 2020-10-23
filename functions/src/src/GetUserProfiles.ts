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
import { getRankArray } from "./GetRankArray"
import { getHousePointTypeHistory } from "./GetHousePointTypeHistory"

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
	const houses = await getAllHouses()
	let user_house: House = houses[0]
	for(const house of houses){
		if(house.id === user.house){
			user_house = house
			break
		}
	}
	data.user_house = user_house
	data.user_rank = await getRank(user)
	data.next_reward = await getNextRewardForHouse(user_house)
	data.houses = houses

	const rankArray = await getRankArray(user_house)
	data.year_rank = rankArray.getYearlyRank()
	data.semester_rank = rankArray.getSemesterRank()

	if(!systemPreferences.isCompetitionVisible){
		data.user_rank = {}
		data.next_reward = {}
		data.houses = []
	}

	if(!systemPreferences.showRewards){
		data.next_reward = {}
	}

	data.last_submissions = await getPointLogsForUser(user, 5)

	return data
}

export declare type ResidentProfile = {
    user_house: any[],
    user_rank: any,
    next_reward: any,
	last_submissions: any[],
	year_rank: any,
	semester_rank: any
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
	const houses = await getAllHouses()
	let user_house: House = houses[0]
	for(const house of houses){
		if(house.id === user.house){
			user_house = house
			break
		}
	}
	data.user_house = user_house
	data.user_rank = await getRank(user)
	data.next_reward = await getNextRewardForHouse(user_house)
	data.houses = houses

	const rankArray = await getRankArray(user_house)
	data.year_rank = rankArray.getYearlyRank()
	data.semester_rank = rankArray.getSemesterRank()

	if(!systemPreferences.isCompetitionVisible){
		data.user_rank = {}
		data.next_reward = {}
		data.houses = []
	}

	if(!systemPreferences.showRewards){
		data.next_reward = {}
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
	year_rank?: any,
	semester_rank?: any
}


/**
 * Gets all information for the overview page if user is an 
 * external advisor
 * @param user User for which to get profile
 * @throws 403 - Invalid permissions
 * @throws 500 - Server Error
 */
export async function getExternalAdvisorProfile(user:User): Promise<ExternalAdvisorProfile>{
	verifyUserHasCorrectPermission(user, [UserPermissionLevel.EXTERNAL_ADVISOR])
	const data:ExternalAdvisorProfile = {}
	const housesModels = await getAllHouses()
	data.houses = []
	for(const houseModel of housesModels){
		//Convert the house into a JSON model
		const house = Object.assign({}, houseModel) as any
		house.color = houseModel.color
		house.numberOfResidents = houseModel.numberOfResidents
		house.totalPoints = houseModel.totalPoints
		house.id = houseModel.id
		house.pointsPerResident = houseModel.pointsPerResident
		data.houses.push(house)
	}
	
	return data
}


export declare type ExternalAdvisorProfile = {
	houses?: any[]
}
/**
 * Gets all information for the overview page if user is resident
 *  *** and temporaryly, rhp and privileged res
 * @param user User for which to get profile
 * @throws 403 - Invalid permissions
 * @throws 500 - Server Error
 */
export async function getProfessionalStaffProfile(user:User): Promise<ProfessionalStaffProfile>{
	verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
	const data:ProfessionalStaffProfile = {}
	const housesModels = await getAllHouses()
	data.houses = []
	for(const houseModel of housesModels){
		//Convert the house into a JSON model
		const house = Object.assign({}, houseModel) as any
		const rankArray = await getRankArray(houseModel)
		const pointTypes = await getHousePointTypeHistory(houseModel)
		house.yearRank = rankArray.getYearlyRank()
		house.semesterRank = rankArray.getSemesterRank()
		house.submissions = pointTypes.housePointTypes
		data.houses.push(house)
	}
	
	return data
}


export declare type ProfessionalStaffProfile = {
	houses?: any[]
}