export class Reward {

    static FILE_NAME = "FileName"
    static REQUIRED_PPR = "RequiredPPR"
    static REQUIRED_VALUE = "RequiredValue"

    id: String
    fileName: String
    requiredPPR: number
    requiredValue: number

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;

        if( Reward.FILE_NAME in document.data()) {
            this.fileName = document.data()[Reward.FILE_NAME];
        }
        else {
            this.fileName = ""
        }

        if( Reward.REQUIRED_PPR in document.data()) {
            this.requiredPPR = document.data()[Reward.REQUIRED_PPR]
        }
        else {
            this.requiredPPR = -1
        }

        if( Reward.REQUIRED_VALUE in document.data()) {
            this.requiredValue = document.data()[Reward.REQUIRED_VALUE]
        }
        else {
            this.requiredValue = -1
        }
    }
}