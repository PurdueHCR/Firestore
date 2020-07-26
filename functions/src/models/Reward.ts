export class Reward {

    static REQUIRED_PPR = "RequiredPPR"
    static NAME = "Name"
    static DOWNLOAD_URL = "DownloadURL"
    static FILE_NAME = "FileName"

    id: string
    name: string
    fileName: string
    requiredPPR: number
    downloadURL: string

    constructor(id: string, name: string, fileName: string, requiredPPR: number, downloadURL: string){
        this.id = id
        this.requiredPPR = requiredPPR
        this.name = name
        this.fileName = fileName
        this.downloadURL = downloadURL
    }

    firestoreJson(){
        const data = {}
        data[Reward.REQUIRED_PPR] = this.requiredPPR
        data[Reward.NAME] = this.name
        data[Reward.DOWNLOAD_URL] = this.downloadURL
        data[Reward.FILE_NAME] = this.fileName
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
        let requiredPPR: number
        let name: string
        let downloadURL: string
        let fileName: string

        fileName = document[Reward.FILE_NAME]
        requiredPPR = document[Reward.REQUIRED_PPR]
        name = document[Reward.NAME]
        downloadURL = document[Reward.DOWNLOAD_URL]
        return new Reward(id, name, fileName, requiredPPR, downloadURL)
    }

}