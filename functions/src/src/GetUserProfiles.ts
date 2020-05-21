import { getUser } from "./GetUser"
import { UserPermissionLevel } from "../models/UserPermissionLevel"
import { APIResponse } from "../models/APIResponse"
import { getSystemPreferences } from "./GetSystemPreferences"
import { getAllHouses } from "./GetHouses"
import { House } from "../models/House"
import { getRank } from "./GetUserRank"
import { getNextRewardForHouse } from "./GetReward"
import { getPointLogsForUser } from "./GetPointLogsForUser"

export async function getResidentProfile(user_id:string): Promise<ResidentProfile>{
    const user = await getUser(user_id)
		if(user.permissionLevel !== UserPermissionLevel.RESIDENT){
			return Promise.reject(APIResponse.InvalidPermissionLevel())
		}
		else{
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
}

export declare type ResidentProfile = {
    user_house: any[],
    user_rank: any,
    next_reward: any,
    last_submissions: any[]
}