///-----------------------------------------------------------------
///   Description:    All type declarations and defaults used for testing
///   Author:         Brian Johncox                    Date: 7/13/2020
///   Notes:          
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------


///--------------------- All House Code OPTIONS ------------------

export declare type AllHousesOptions = {
    copper?: HouseOptions,
    palladium?:HouseOptions,
    platinum?:HouseOptions,
    silver?:HouseOptions,
    titanium?:HouseOptions
}

///----------------------------------------------------------------

///------------------------ House Code OPTIONS -------------------

export declare type HouseCodeOptions = {
    code?: string,
    code_name?: string,
    floor_id?: string,
    house?: string,
    permission_level?: number
}

export const HOUSE_CODE_DEFAULTS:HouseCodeOptions = {
    code: "4N1234",
    code_name: "4N Resident",
    floor_id: "4N",
    house: "Platinum",
    permission_level: 0
}

///----------------------------------------------------------------

///-------------------------- House OPTIONS ----------------------

export declare type HouseOptions = {
    color?: string
    num_residents?: number
    total_points?: number
}

export const HOUSE_DEFAULTS:HouseOptions = {
    color: "#5AC0C7",
    total_points: 20,
    num_residents: 200
}

///----------------------------------------------------------------

///-------------------------- Link OPTIONS ------------------------

export declare type LinkOptions = {
    archived?: boolean,
    description?: string,
    enabled?: boolean,
    single_use?: boolean,
    claimed_count?: number
}

export const LINK_DEFAULTS:LinkOptions = {
    archived: false,
    description: "Basic description",
    enabled: true,
    single_use: true,
    claimed_count: 0
}
///----------------------------------------------------------------

///-------------------- Point Log Message Options -----------------

export declare type PointLogMessageOptions = {
    creation_date?: Date
    message?: string
    message_type?: string
    sender_first_name?: string
    sender_last_name?: string
    sender_permission_level?: number
}

export const MESSAGE_DEFAULTS:PointLogMessageOptions = {
    creation_date: new Date(Date.now()),
    message: "Empty Message",
    message_type: "comment",
    sender_first_name: "First",
    sender_last_name: "Last",
    sender_permission_level: 0
}

///----------------------------------------------------------------

///------------------------ Point Log Options ---------------------

export declare type PointLogOptions = {
    id?:string,
    approved_by?:string,
    approved_on?:Date,
    date_occurred?:Date,
    date_submitted?:Date,
    description?:string,
    floor_id?:string,
    point_type_id?:number,
    point_type_name?:string,
    point_type_description?:string,
    rhp_notifications?:number,
    resident_first_name?:string,
    resident_last_name?:string,
    resident_notifications?:number,
    approved?:boolean
}

export const POINT_LOG_DEFAULTS:PointLogOptions = {
    approved_by: "Preapproved",
    approved_on: new Date(Date.parse("5/18/2020")),
    date_occurred: new Date(Date.parse("5/18/2020")),
    date_submitted: new Date(Date.parse("5/18/2020")),
    description: "Empty Description",
    floor_id: "4N",
    point_type_id: 1,
    point_type_name: "PLACEHOLDER PT NAME",
    point_type_description: "PLACEHOLDER PT DESCR",
    rhp_notifications: 0,
    resident_first_name: "TEST_FIRST",
    resident_last_name: "TEST_LAST",
    resident_notifications: 0,
    approved: false
    
}

///----------------------------------------------------------------

///----------------------- Point Type Options ---------------------

export declare type PointTypeOptions = {
    description?: string
    name?: string
    is_enabled?: boolean
    permission_level?: number
    residents_can_submit?: boolean
    value?: number
};

export const POINT_TYPE_DEFAULTS:PointTypeOptions = {
    description: "Empty Point Type Description",
    name: "Empty Point Type Name",
    is_enabled: true,
    permission_level: 2,
    residents_can_submit: true,
    value: 1
}

///----------------------------------------------------------------

///------------------------- Reward Options -----------------------

export declare type RewardOptions = {
    id?: string
    required_ppr?: number,
    required_value?: number
}

export const REWARD_DEFAULTS:RewardOptions = {
    id: "Pizza Party",
    required_ppr: 100,
    required_value: 20000
}

///----------------------------------------------------------------

///------------------- System Preferences Options -----------------

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

///----------------------------------------------------------------

///-------------------------- User OPTIONS ------------------------

export declare type UserOptions = {
    first?:string, 
    floor_id?:string,
    house_name?:string,
    last?:string,
    semester_points?:number,
    total_points?:number
}

export const USER_DEFAULTS:UserOptions = {
    first: "TEST_FIRST",
    last: "TEST_LAST",
    total_points: 0,
    semester_points: 0,
    house_name: "Platinum",
    floor_id: "4N"
}

///----------------------------------------------------------------

///------------------------- Event OPTIONS ------------------------

export declare type EventOptions = {
    name?: string,
    details?: string,
    date?: Date,
    location?: string,
    points?: number,
    point_type_id?: number,
    point_type_name?: string,
    point_type_description?: string,
    house?: string
}

export const EVENT_DEFAULTS:EventOptions = {
    name: "TEST_NAME",
    details: "TEST_DETAILS",
    date: new Date(),
    location: "TEST_LOCATION",
    points: 1,
    point_type_id: 1,
    point_type_name: "TEST_TYPE_NAME",
    point_type_description: "TEST_TYPE_DESCRIPTION",
    house: "All Houses"
}
///----------------------------------------------------------------

