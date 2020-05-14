export class SystemPreference {

    static ANDROID_VERSION = "Android_Version"
    static ONE_TIME_CODE = "OneTimeCode"
    static HOUSE_ENABLED_MESSAGE = "houseEnabledMessage"
    static IOS_VERSION = "iOS_Version"
    static IS_HOUSE_ENABLED = "isHouseEnabled"
    static SUGGESTED_POINT_IDS = "suggestedPointIDs"

    id: String
    androidVersion: String
    oneTimeCode: String
    houseEnabledMessage: String
    iosVersion: String
    isHouseEnabled: Boolean
    suggestedPointIds: String

    constructor(id:String, androidVersion: String, oneTimeCode: String, houseEnabledMessage: String, iosVersion: String, isHouseEnabled: Boolean, suggestedPointIds: String){
        this.id = id
        this.androidVersion = androidVersion
        this.oneTimeCode = oneTimeCode
        this.houseEnabledMessage = houseEnabledMessage
        this.iosVersion = iosVersion
        this.isHouseEnabled = isHouseEnabled
        this.suggestedPointIds = suggestedPointIds
    }

    static fromDocument(document: FirebaseFirestore.DocumentSnapshot): SystemPreference{
        let id: String
        let androidVersion: String
        let oneTimeCode: String
        let houseEnabledMessage: String
        let iosVersion: String
        let isHouseEnabled: Boolean
        let suggestedPointIds: String
        id = document.id;

        if( SystemPreference.ANDROID_VERSION in document.data()!){
            androidVersion = document.data()![SystemPreference.ANDROID_VERSION];
        }
        else{
            androidVersion = ""
        }

        if( SystemPreference.ONE_TIME_CODE in document.data()!){
            oneTimeCode = document.data()![SystemPreference.ONE_TIME_CODE];
        }
        else{
            oneTimeCode = ""
        }

        if( SystemPreference.HOUSE_ENABLED_MESSAGE in document.data()!){
            houseEnabledMessage = document.data()![SystemPreference.HOUSE_ENABLED_MESSAGE];
        }
        else{
            houseEnabledMessage = ""
        }

        if( SystemPreference.IOS_VERSION in document.data()!){
            iosVersion = document.data()![SystemPreference.IOS_VERSION];
        }
        else{
            iosVersion = ""
        }

        if( SystemPreference.IS_HOUSE_ENABLED in document.data()!){
            isHouseEnabled = document.data()![SystemPreference.IS_HOUSE_ENABLED];
        }
        else{
            isHouseEnabled = false
        }

        if( SystemPreference.SUGGESTED_POINT_IDS in document.data()!){
            suggestedPointIds = document.data()![SystemPreference.SUGGESTED_POINT_IDS];
        }
        else{
            suggestedPointIds = "";
        }
        return new SystemPreference(id, androidVersion, oneTimeCode, houseEnabledMessage, iosVersion, isHouseEnabled, suggestedPointIds);
    }


}