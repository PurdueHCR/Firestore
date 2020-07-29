export class SystemPreference {

    static ANDROID_VERSION = "Android_Version"
    static COMPETITION_DISABLED_MESSAGE = "houseEnabledMessage"
    static COMPETITION_HIDDEN_MESSAGE = "competitionHiddenMessage"
    static IOS_VERSION = "iOS_Version"
    static IS_COMPETITION_ENABLED = "isHouseEnabled"
    static IS_COMPETITION_VISIBLE = "isCompetitionVisible"
    static SUGGESTED_POINT_IDS = "suggestedPointIDs"
    static HOUSE_IDS = "houseIDs"
    static DEFAULT_IMAGE_URL = "DefaultImageURL"
    static DEFAULT_IMAGE_NAME = "DefaultImageName"

    id: string
    androidVersion: string
    competitionDisabledMessage: string
    competitionHiddenMessage: string
    iosVersion: string
    isCompetitionEnabled: Boolean
    suggestedPointIds: string
    isCompetitionVisible: Boolean
    defaultImageURL: string
    defaultImageName: string
    houseIds: string[]

    constructor(id:string, androidVersion: string,  competitionDisabledMessage: string, iosVersion: string, competitionHiddenMessage:string, 
        isCompetitionEnabled: Boolean, suggestedPointIds: string, isCompetitionVisible: Boolean, houseIds: string[], defaultImageURL: string,
        defaultImageName: string){
        this.id = id
        this.androidVersion = androidVersion
        this.competitionDisabledMessage = competitionDisabledMessage
        this.competitionHiddenMessage = competitionHiddenMessage
        this.iosVersion = iosVersion
        this.isCompetitionEnabled = isCompetitionEnabled
        this.suggestedPointIds = suggestedPointIds
        this.isCompetitionVisible = isCompetitionVisible
        this.houseIds = houseIds
        this.defaultImageName = defaultImageName
        this.defaultImageURL = defaultImageURL
    }

    updateFirebaseJson(){
        const data= {}
        data[SystemPreference.COMPETITION_DISABLED_MESSAGE] = this.competitionDisabledMessage
        data[SystemPreference.COMPETITION_HIDDEN_MESSAGE] = this.competitionHiddenMessage
        data[SystemPreference.IS_COMPETITION_ENABLED] = this.isCompetitionEnabled
        data[SystemPreference.IS_COMPETITION_VISIBLE] = this.isCompetitionVisible
        data[SystemPreference.HOUSE_IDS] = this.houseIds
        data[SystemPreference.DEFAULT_IMAGE_NAME] = this.defaultImageName
        data[SystemPreference.DEFAULT_IMAGE_URL] = this.defaultImageURL
        return data
    }

    firebaseJson(){
        const data = this.updateFirebaseJson()
        data[SystemPreference.ANDROID_VERSION] = this.androidVersion
        data[SystemPreference.IOS_VERSION] = this.iosVersion
        data[SystemPreference.SUGGESTED_POINT_IDS] = this.suggestedPointIds
        return data
    }

    static fromDocument(document: FirebaseFirestore.DocumentSnapshot): SystemPreference{
        let id: string
        let androidVersion: string
        let competitionDisabledMessage: string
        let competitionHiddenMessage: string
        let houseIds: string[]
        let iosVersion: string
        let isCompetitionEnabled: Boolean
        let suggestedPointIds: string
        let isCompetitionVisible: Boolean
        let defaultImageURL: string
        let defaultImageName: string
        id = document.id;

        if( SystemPreference.ANDROID_VERSION in document.data()!){
            androidVersion = document.data()![SystemPreference.ANDROID_VERSION];
        }
        else{
            androidVersion = ""
        }

        if( SystemPreference.COMPETITION_HIDDEN_MESSAGE in document.data()!){
            competitionHiddenMessage = document.data()![SystemPreference.COMPETITION_HIDDEN_MESSAGE];
        }
        else{
            competitionHiddenMessage = ""
        }

        if( SystemPreference.COMPETITION_DISABLED_MESSAGE in document.data()!){
            competitionDisabledMessage = document.data()![SystemPreference.COMPETITION_DISABLED_MESSAGE];
        }
        else{
            competitionDisabledMessage = ""
        }

        if( SystemPreference.IOS_VERSION in document.data()!){
            iosVersion = document.data()![SystemPreference.IOS_VERSION];
        }
        else{
            iosVersion = ""
        }

        if( SystemPreference.IS_COMPETITION_ENABLED in document.data()!){
            isCompetitionEnabled = document.data()![SystemPreference.IS_COMPETITION_ENABLED];
        }
        else{
            isCompetitionEnabled = false
        }

        if( SystemPreference.IS_COMPETITION_VISIBLE in document.data()!){
            isCompetitionVisible = document.data()![SystemPreference.IS_COMPETITION_VISIBLE];
        }
        else{
            isCompetitionVisible = false
        }

        if( SystemPreference.SUGGESTED_POINT_IDS in document.data()!){
            suggestedPointIds = document.data()![SystemPreference.SUGGESTED_POINT_IDS];
        }
        else{
            suggestedPointIds = "";
        }

        if( SystemPreference.HOUSE_IDS in document.data()!){
            houseIds = document.data()![SystemPreference.HOUSE_IDS]
        }
        else{
            houseIds = []
        }

        if(SystemPreference.DEFAULT_IMAGE_NAME in document.data()!){
            defaultImageName = document.data()![SystemPreference.DEFAULT_IMAGE_NAME]
        }
        else{
            defaultImageName = ""
        }

        if(SystemPreference.DEFAULT_IMAGE_URL in document.data()!){
            defaultImageURL = document.data()![SystemPreference.DEFAULT_IMAGE_URL]
        }
        else{
            defaultImageURL = ""
        }

        return new SystemPreference(id, androidVersion, competitionDisabledMessage, iosVersion, competitionHiddenMessage, isCompetitionEnabled, suggestedPointIds, isCompetitionVisible, houseIds, defaultImageURL, defaultImageName);
    }
}
