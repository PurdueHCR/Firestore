import { House } from "./House"
import { HouseCode } from "./Housecode"
import { PointType } from "./PointType"
import { Reward } from "./Reward"
import { SystemPreference } from "./SystemPreference"
import { Link } from "./Link"
import { User } from "./User"

export class HouseCompetition {

    static HOUSE_KEY = "House"
    static HOUSE_CODES_KEY = "HouseCodes"
    static LINKS_KEY = "Links"
    static POINT_TYPES_KEY = "PointTypes"
    static REWARDS_KEY = "Rewards"
    static SYSTEM_PREFERENCES_KEY = "SystemPreferences"
    static USERS_KEY = "Users"

    houses: House[] = []
    houseCodes: HouseCode[] = []
    links: Link[] = []
    pointTypes: PointType[] = []
    rewards: Reward[] = []
    systemPreference: SystemPreference = new SystemPreference()
    users: User[] = []
}