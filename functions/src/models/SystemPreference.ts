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

    constructor(){
        this.id = ""
        this.androidVersion = ""
        this.oneTimeCode = ""
        this.houseEnabledMessage = ""
        this.iosVersion = ""
        this.isHouseEnabled = false
        this.suggestedPointIds = ""
    }

    set(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;

        if( SystemPreference.ANDROID_VERSION in document.data()){
            this.androidVersion = document.data()[SystemPreference.ANDROID_VERSION];
        }
        else{
            this.androidVersion = ""
        }

        if( SystemPreference.ONE_TIME_CODE in document.data()){
            this.oneTimeCode = document.data()[SystemPreference.ONE_TIME_CODE];
        }
        else{
            this.oneTimeCode = ""
        }

        if( SystemPreference.HOUSE_ENABLED_MESSAGE in document.data()){
            this.houseEnabledMessage = document.data()[SystemPreference.HOUSE_ENABLED_MESSAGE];
        }
        else{
            this.houseEnabledMessage = ""
        }

        if( SystemPreference.IOS_VERSION in document.data()){
            this.iosVersion = document.data()[SystemPreference.IOS_VERSION];
        }
        else{
            this.iosVersion = ""
        }

        if( SystemPreference.IS_HOUSE_ENABLED in document.data()){
            this.isHouseEnabled = document.data()[SystemPreference.IS_HOUSE_ENABLED];
        }
        else{
            this.isHouseEnabled = false
        }

        if( SystemPreference.SUGGESTED_POINT_IDS in document.data()){
            this.suggestedPointIds = document.data()[SystemPreference.SUGGESTED_POINT_IDS];
        }
        else{
            this.suggestedPointIds = "";
        }
    }


}