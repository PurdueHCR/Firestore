import * as firebase from "@firebase/testing"

export class FirestoreDataFactory{

    /**
     * Sets the system preferences in the test database
     * 
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param spOpts - Optional parameters for the system preferences. If a field doesnt exist, it will be set to a default
     */
    static setSystemPreference(db:firebase.firestore.Firestore, spOpts:SystemPreferenceOptions = SYSTEM_PREFERENCES_DEFAULTS): Promise<void>{
        return db.collection("SystemPreferences").doc("Preferences").set({
            "Android_Version": (spOpts.android_version !== undefined)?spOpts.android_version:SYSTEM_PREFERENCES_DEFAULTS.android_version,
            "OneTimeCode": (spOpts.one_time_code !== undefined)?spOpts.one_time_code:SYSTEM_PREFERENCES_DEFAULTS.one_time_code,
            "competitionHiddenMessage": (spOpts.competition_hidden_message !== undefined)?spOpts.competition_hidden_message:SYSTEM_PREFERENCES_DEFAULTS.competition_hidden_message,
            "houseEnabledMessage": (spOpts.house_enabled_message !== undefined)?spOpts.house_enabled_message:SYSTEM_PREFERENCES_DEFAULTS.house_enabled_message,
            "iOS_Version":(spOpts.ios_version !== undefined)?spOpts.ios_version:SYSTEM_PREFERENCES_DEFAULTS.ios_version,
            "isCompetitionVisible":(spOpts.is_competition_visible !== undefined)?spOpts.is_competition_visible:SYSTEM_PREFERENCES_DEFAULTS.is_competition_visible,
            "isHouseEnabled": (spOpts.is_house_enabled !== undefined)?spOpts.is_house_enabled:SYSTEM_PREFERENCES_DEFAULTS.is_house_enabled,
            "suggestedPointIDs": (spOpts.suggested_point_ids !== undefined)?spOpts.suggested_point_ids:SYSTEM_PREFERENCES_DEFAULTS.suggested_point_ids
        })
    }

    /**
     * Create or set the value of a point type for the given id
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param id - ID number for the point type
     * @param ptopts - Optional Parameters for the point type. Will be set to default if field isnt provided
     */
    static setPointType(db: firebase.firestore.Firestore, id: number, ptopts:PointTypeOptions = POINT_TYPE_DEFAULTS): Promise<void>{
        return db.collection("PointTypes").doc(id.toString()).set({
            "Description":(ptopts.description !== undefined)? ptopts.description: POINT_TYPE_DEFAULTS.description,
            "Name":(ptopts.name !== undefined)? ptopts.name: POINT_TYPE_DEFAULTS.name,
            "Enabled":(ptopts.is_enabled !== undefined)? ptopts.is_enabled: POINT_TYPE_DEFAULTS.is_enabled,
            "PermissionLevel":(ptopts.permission_level !== undefined)? ptopts.permission_level : POINT_TYPE_DEFAULTS.permission_level,
            "ResidentsCanSubmit": (ptopts.residents_can_submit !== undefined)? ptopts.residents_can_submit : POINT_TYPE_DEFAULTS.residents_can_submit,
            "Value": (ptopts.value !== undefined)? ptopts.value : POINT_TYPE_DEFAULTS.value
        })
    }

    /**
     * Create or set the value for a house with the given id
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param id - Name of the house
     * @param hOpts  - Optional Parameters for the house. Will be set to default if field isnt provided
     */
    static setHouse(db: firebase.firestore.Firestore, id: string, hOpts:HouseOptions = HOUSE_DEFAULTS): Promise<void> {
        console.log("SETTING HOUSE:", (hOpts.total_points !== undefined)? hOpts.total_points: HOUSE_DEFAULTS.total_points)
        return db.collection("House").doc(id).set({
            "Color":(hOpts.color !== undefined)? hOpts.color: HOUSE_DEFAULTS.color,
            "NumberOfResidents":(hOpts.num_residents !== undefined)? hOpts.num_residents: HOUSE_DEFAULTS.num_residents,
            "TotalPoints":(hOpts.total_points !== undefined)? hOpts.total_points: HOUSE_DEFAULTS.total_points
        })
    }

    static setHouseCode(db: firebase.firestore.Firestore, id: string, cOpts:HouseCodeOptions = HOUSE_CODE_DEFAULTS): Promise<void> {
        console.log("SETTING HOUSE CODE:", (cOpts.code !== undefined)? cOpts.code: HOUSE_CODE_DEFAULTS.code)
        return db.collection("HouseCodes").doc(id).set({
            "Code":(cOpts.code !== undefined)? cOpts.code: HOUSE_CODE_DEFAULTS.code,
            "CodeName":(cOpts.code_name !== undefined)? cOpts.code: HOUSE_CODE_DEFAULTS.code_name,
            "FloorId":(cOpts.floor_id !== undefined)? cOpts.code: HOUSE_CODE_DEFAULTS.floor_id,
            "House":(cOpts.house !== undefined)? cOpts.house: HOUSE_CODE_DEFAULTS.house,
            "PermissionLevel":(cOpts.permission_level !== undefined)? cOpts.permission_level: HOUSE_CODE_DEFAULTS.permission_level
        })
    }

    /**
     * Create ell 5 houses in the competition. Default data will be used if none is provided in houseOpts
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param houseOpts - Optional Parameters for each of the houses. Will be set to defaults if not provided
     */
    static async setAllHouses(db: firebase.firestore.Firestore, houseOpts:AllHousesOptions){
        await this.setHouse(db,"Copper",houseOpts.copper)
        await this.setHouse(db,"Palladium",houseOpts.palladium)
        await this.setHouse(db,"Platinum", houseOpts.platinum)
        await this.setHouse(db,"Silver", houseOpts.silver)
        await this.setHouse(db,"Titanium",houseOpts.titanium)
    }

    /**
     * Create or set teh value for a user with the ID and permission level
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param id - Id for the user
     * @param permission_level - int that represents the permission level
     * @param uOpts - Optional parameters for the user. Will be set to default if field isn't provided
     */
    static setUser(db: firebase.firestore.Firestore, id: string, permission_level: number, uOpts:UserOptions = USER_DEFAULTS): Promise<void> {
        switch(permission_level){
            case 0:
                //Resident
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first, 
                    "FloorID":(uOpts.floor_id !== undefined)? uOpts.floor_id:USER_DEFAULTS.floor_id,
                    "House":(uOpts.house_name !== undefined)? uOpts.house_name:USER_DEFAULTS.house_name,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "SemesterPoints":(uOpts.semester_points !== undefined)? uOpts.semester_points: USER_DEFAULTS.semester_points,
                    "Permission Level":0, 
                    "TotalPoints":(uOpts.total_points !== undefined)? uOpts.total_points: USER_DEFAULTS.total_points
                })
            case 1:
                //RHP
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first, 
                    "FloorID":(uOpts.floor_id !== undefined)? uOpts.floor_id:USER_DEFAULTS.floor_id,
                    "House":(uOpts.house_name !== undefined)? uOpts.house_name:USER_DEFAULTS.house_name,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "SemesterPoints":(uOpts.semester_points !== undefined)? uOpts.semester_points: USER_DEFAULTS.semester_points,
                    "Permission Level":1, 
                    "TotalPoints":(uOpts.total_points !== undefined)? uOpts.total_points: USER_DEFAULTS.total_points
                })
            case 2:
                //REC
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "Permission Level":2
                })
            case 3:
                //FHP
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first, 
                    "House":(uOpts.house_name !== undefined)? uOpts.house_name:USER_DEFAULTS.house_name,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "Permission Level":3
                })
            case 4:
                //Privileged Resident
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first, 
                    "FloorID":(uOpts.floor_id !== undefined)? uOpts.floor_id:USER_DEFAULTS.floor_id,
                    "House":(uOpts.house_name !== undefined)? uOpts.house_name:USER_DEFAULTS.house_name,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "SemesterPoints":(uOpts.semester_points !== undefined)? uOpts.semester_points: USER_DEFAULTS.semester_points,
                    "Permission Level":4, 
                    "TotalPoints":(uOpts.total_points !== undefined)? uOpts.total_points: USER_DEFAULTS.total_points
                })
            case 5:
                //Non-Honors Affiliated Staff
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "Permission Level":5
                })
            default:
                return db.collection("Users").doc(id).set({
                    "FirstName":(uOpts.first !== undefined)? uOpts.first: USER_DEFAULTS.first, 
                    "FloorID":(uOpts.floor_id !== undefined)? uOpts.floor_id:USER_DEFAULTS.floor_id,
                    "House":(uOpts.house_name !== undefined)? uOpts.house_name:USER_DEFAULTS.house_name,
                    "LastName":(uOpts.last !== undefined)? uOpts.last:USER_DEFAULTS.last,
                    "SemesterPoints":(uOpts.semester_points !== undefined)? uOpts.semester_points: USER_DEFAULTS.semester_points,
                    "Permission Level":0, 
                    "TotalPoints":(uOpts.total_points !== undefined)? uOpts.total_points: USER_DEFAULTS.total_points
                })
        }
    }
    
    /**
     * Create or update a pointlog
     * @param db - Test App Firestore instance (Usually from authedApp())
     * @param house - name of the house to add point log for
     * @param resident_id - id of resident to add point log for
     * @param approved - boolean for if the pointlog was already approved. (used to set the approved fields and sign of point type ID)
     * @param ptOpts - Optional parameters to modifu the point log
     */
    static setPointLog(db: firebase.firestore.Firestore, house:string, resident_id:string, approved: boolean, ptOpts:PointLogOptions = POINT_LOG_DEFAULTS): Promise<firebase.firestore.DocumentReference| void>{
        let data = {
            "DateOccurred":(ptOpts.date_occurred !== undefined)?ptOpts.date_occurred:POINT_LOG_DEFAULTS.date_occurred,
            "DateSubmitted":(ptOpts.date_submitted !== undefined)?ptOpts.date_submitted:POINT_LOG_DEFAULTS.date_submitted,
            "Description":(ptOpts.date_submitted !== undefined)?ptOpts.description:POINT_LOG_DEFAULTS.date_submitted,
            "FloorID":(ptOpts.floor_id !== undefined)?ptOpts.floor_id:POINT_LOG_DEFAULTS.floor_id,
            "PointTypeID":(ptOpts.point_type_id !== undefined)?ptOpts.point_type_id:POINT_LOG_DEFAULTS.point_type_id! * -1,
            "RHPNotifications":(ptOpts.rhp_notifications !== undefined)?ptOpts.rhp_notifications:POINT_LOG_DEFAULTS.rhp_notifications,
            "ResidentFirstName":(ptOpts.resident_first_name !== undefined)?ptOpts.resident_first_name:POINT_LOG_DEFAULTS.resident_first_name,
            "ResidentId":resident_id,
            "ResidentLastName":(ptOpts.resident_last_name !== undefined)?ptOpts.resident_last_name:POINT_LOG_DEFAULTS.resident_last_name,
            "ResidentNotifications":(ptOpts.resident_notifications !== undefined)?ptOpts.resident_notifications:POINT_LOG_DEFAULTS.resident_notifications
        }
        if(!approved){
            data["ApprovedBy"] = (ptOpts.approved_by !== undefined)?ptOpts.approved_by:POINT_LOG_DEFAULTS.approved_by
            data["ApprovedOn"] = (ptOpts.approved_on !== undefined)?ptOpts.approved_on:POINT_LOG_DEFAULTS.approved_on
            data["PointTypeID"] = data["PointTypeID"] * -1
        }
        if(ptOpts.id){
            return db.collection("House").doc(house).collection("Points").doc(ptOpts.id!).set(data)
        }
        else{
            return db.collection("House").doc(house).collection("Points").add(data)
        }
        
    }

    static setLink(db: firebase.firestore.Firestore, link_id: string, creator_id: string, point_type_id: number, linkOpts: LinkOptions = LINK_DEFAULTS){
        let data = {
            Archived:linkOpts.archived,
            CreatorID:creator_id,
            Description:linkOpts.description,
            Enabled: linkOpts.enabled,
            PointID: point_type_id,
            SingleUse: linkOpts.single_use
        }
        return db.collection("Links").doc(link_id).set(data)
    }

    /**
     * Create multiple pointlogs for the given user
     * @param db  - Test App Firestore instance (Usually from authedApp())
     * @param house - ID of house to make point logs for
     * @param resident_id - id of resident to make point logs for
     * @param count - number of point logs to create
     */
    static async createMultiplePointLogs(db: firebase.firestore.Firestore, house:string, resident_id:string, count:number){
        for(let i = 0; i < count; i++){
            await this.setPointLog(db, house, resident_id, true)
        }
    }

    /**
     * Create or update a reward
     * @param db  - Test App Firestore instance (Usually from authedApp())
     * @param rOpts - Optional parameters for the Reward
     */
    static setReward(db: firebase.firestore.Firestore, rOpts:RewardOptions = REWARD_DEFAULTS): Promise<void> {
        return db.collection("Rewards").doc((rOpts.id)?rOpts.id:REWARD_DEFAULTS.id).set({
            FileName:(rOpts.id !== undefined)?rOpts.id+".png":REWARD_DEFAULTS.id+".png",
            RequiredPPR:(rOpts.required_ppr !== undefined)?rOpts.required_ppr:REWARD_DEFAULTS.required_ppr,
            RequiredValue:(rOpts.required_value !== undefined)?rOpts.required_value:REWARD_DEFAULTS.required_value
        })
    }
}

/**
 * Type declaration for optional params for System Preference. Undefined fields will be defaulted.
 */
export declare type SystemPreferenceOptions = {
    android_version?: string
    one_time_code?: string
    competition_hidden_message?: string
    house_enabled_message?: string
    ios_version?: string
    is_competition_visible?: boolean
    is_house_enabled?: boolean
    suggested_point_ids?: string
};

/**
 * Type declaration for optional params for point type. Undefined fields will be defaulted.
 */
export declare type PointTypeOptions = {
    description?: string
    name?: string
    is_enabled?: boolean
    permission_level?: number
    residents_can_submit?: boolean
    value?: number
};

/**
 * Type declaration for optional params for House Options. Undefined fields will be defaulted.
 */
export declare type HouseOptions = {
    color?: string
    num_residents?: number
    total_points?: number
}

/**
 * Type declaration to add parameters for multiple houses at once. Undefined fields will be defaulted.
 */
export declare type AllHousesOptions = {
    copper?: HouseOptions,
    palladium?:HouseOptions,
    platinum?:HouseOptions,
    silver?:HouseOptions,
    titanium?:HouseOptions
}

/**
 * Type declaration for optional params for House Code Options. Undefined fields will be defaulted.
 */
export declare type HouseCodeOptions = {
    code?: string,
    code_name?: string,
    floor_id?: string,
    house?: string,
    permission_level?: number
}

/**
 * Type declaration for optional params for User Options. Undefined fields will be defaulted.
 */
export declare type UserOptions = {
    first?:string, 
    floor_id?:string,
    house_name?:string,
    last?:string,
    semester_points?:number,
    total_points?:number
}

/**
 * Type declaration for fields to add to a point log. Undefined fields will be defaulted.
 */
export declare type PointLogOptions = {
    id?:string,
    approved_by?:string,
    approved_on?:Date,
    date_occurred?:Date,
    date_submitted?:Date,
    description?:string,
    floor_id?:string,
    point_type_id?:number,
    rhp_notifications?:number,
    resident_first_name?:string,
    resident_last_name?:string,
    resident_notifications?:number

}

/**
 * Type declaration for fields to add to reward. Undefined fields will be defaulted.
 */
export declare type RewardOptions = {
    id?: string
    required_ppr?: number,
    required_value?: number
}

/**
 * Type Declaration for fields to add to Link. Undefined fields will be defaulted
 */
export declare type LinkOptions = {
    archived?: boolean,
    description?: string,
    enabled?: boolean,
    single_use?: boolean
}

export const LINK_DEFAULTS:LinkOptions = {
    archived: false,
    description: "Basic description",
    enabled: true,
    single_use: true
}

/**
 * Default fields for Reward
 */
export const REWARD_DEFAULTS:RewardOptions = {
    id: "Pizza Party",
    required_ppr: 100,
    required_value: 20000
}

/**
 * Default fields for point log
 */
export const POINT_LOG_DEFAULTS:PointLogOptions = {
    approved_by: "Preapproved",
    approved_on: new Date(Date.parse("5/18/2020")),
    date_occurred: new Date(Date.parse("5/18/2020")),
    date_submitted: new Date(Date.parse("5/18/2020")),
    description: "Empty Description",
    floor_id: "4N",
    point_type_id: 1,
    rhp_notifications: 0,
    resident_first_name: "TEST_FIRST",
    resident_last_name: "TEST_LAST",
    resident_notifications: 0

}

/**
 * Default fields for system preferences
 */
export const SYSTEM_PREFERENCES_DEFAULTS:SystemPreferenceOptions = {
    android_version: "2.0.0",
    one_time_code: "abc",
    competition_hidden_message: "hidden",
    house_enabled_message: "Honors1",
    ios_version: "1.6.2",
    is_competition_visible: true,
    is_house_enabled: true,
    suggested_point_ids: "1,2,3,4",
}

/**
 * default fields for point type
 */
export const POINT_TYPE_DEFAULTS:PointTypeOptions = {
    description: "Empty Point Type Description",
    name: "Empty Point Type Name",
    is_enabled: true,
    permission_level: 2,
    residents_can_submit: true,
    value: 1
}

/**
 * Default field for house
 */
export const HOUSE_DEFAULTS:HouseOptions = {
    color: "#5AC0C7",
    total_points: 20,
    num_residents: 200
}

/**
 * Default field for house code
 */
export const HOUSE_CODE_DEFAULTS:HouseCodeOptions = {
    code: "4N1234",
    code_name: "4N Resident",
    floor_id: "4N",
    house: "Platinum",
    permission_level: 0
}

/**
 * Default fields for user
 */
export const USER_DEFAULTS:UserOptions = {
    first: "TEST_FIRST",
    last: "TEST_LAST",
    total_points: 0,
    semester_points: 0,
    house_name: "Platinum",
    floor_id: "4N"
}