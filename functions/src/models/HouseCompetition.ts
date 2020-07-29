import { HouseWithPointLog } from "./House"
import { HouseCode } from "./HouseCode"
import { PointType } from "./PointType"
import { Reward } from "./Reward"
import { Link } from "./Link"
import { User } from "./User"
import { APIResponse } from "./APIResponse"

export class HouseCompetition {

    static EVENTS_KEY = "Events"
    static HOUSE_KEY = "House"
    static HOUSE_DETAILS_KEY = "Details"
    static HOUSE_DETAILS_RANK_DOC = "Rank"
    static HOUSE_DETAILS_POINT_TYPES_DOC = "PointTypes"
    static HOUSE_COLLECTION_POINTS_KEY = "Points"
    static HOUSE_COLLECTION_POINTS_COLLECTION_MESSAGES_KEY = "Messages"
    static HOUSE_CODES_KEY = "HouseCodes"
    static LINKS_KEY = "Links"
    static POINT_TYPES_KEY = "PointTypes"
    static REWARDS_KEY = "Rewards"
    static SYSTEM_PREFERENCES_KEY = "SystemPreferences"
    static SYSTEM_PREFERENCES_DOCUMENT_KEY = "Preferences"
    static USERS_KEY = "Users"

    events: Event[] = []
    houses: HouseWithPointLog[] = []
    houseCodes: HouseCode[] = []
    links: Link[] = []
    pointTypes: PointType[] = []
    rewards: Reward[] = []
    users: User[] = []

    /**
     * Validate that the provided name is a house in the competition
     * @param house name of the house
     * @throws 425 - Unknown House
     */
    static validateHouseName(house:string) {
        if(house !== "Copper" && house !== "Palladium" && house !== "Platinum" && house !== "Silver" && house !== "Titanium"){
            throw APIResponse.UnknownHouse()
        }
    }
}
