export class Reward {

    static FILE_NAME = "FileName"
    static REQUIRED_PPR = "RequiredPPR"
    static REQUIRED_VALUE = "RequiredValue"

    id: string
    fileName: string
    requiredPPR: number
    requiredValue: number

    constructor(id: string, fileName: string, requiredPPR: number, requiredValue: number){
        this.id = id
        this.fileName = fileName
        this.requiredPPR = requiredPPR
        this.requiredValue = requiredValue
    }

    firestoreJson(){
        const data = {}
        data[Reward.FILE_NAME] = this.fileName
        data[Reward.REQUIRED_PPR] = this.requiredPPR
        data[Reward.REQUIRED_VALUE] = this.requiredValue
        return data
    }

    toString():String{
        return this.id+":"+this.requiredPPR.toString()
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): Reward {
        return this.fromData(document.data()!, document.id)
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): Reward[] {
        const rewards: Reward[] = []
        for(const document of snapshot.docs){
            rewards.push(this.fromData(document.data(), document.id))
        }
        return rewards
    }

    private static fromData(document: FirebaseFirestore.DocumentData, doc_id: string): Reward {
        const id = doc_id
        let fileName: string
        let requiredPPR: number
        let requiredValue: number

        fileName = document[Reward.FILE_NAME];
        requiredPPR = document[Reward.REQUIRED_PPR]
        requiredValue = document[Reward.REQUIRED_VALUE]
        return new Reward(id, fileName, requiredPPR, requiredValue)
    }

}