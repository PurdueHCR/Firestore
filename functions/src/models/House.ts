import { PointLog } from "./PointLog"


export class House {
    

    static COLOR = "Color"
    static NUMBER_OF_RESIDENTS = "NumberOfResidents"
    static TOTAL_POINTS =  "TotalPoints"
    static FLOOR_IDS = "FloorIds"
    static DOWNLOAD_URL = "DownloadURL"
    static DESCRIPTION = "Description"

    color: string
    numberOfResidents: number
    totalPoints: number
    id:string
    pointsPerResident: number
    description: string
    downloadURL: string
    floorIds: string[]

    constructor(color:string, numberOfResidents: number, totalPoints: number, floorIds: string[], id: string, downloadURL:string, description:string){
        this.color = color
        this.numberOfResidents = numberOfResidents
        this.totalPoints = totalPoints
        this.id = id
        this.floorIds = floorIds
        this.pointsPerResident = totalPoints/numberOfResidents
        this.description = description
        this.downloadURL = downloadURL
    }

    firestoreJson() {
        const data = {}
        data[House.COLOR] = this.color
        data[House.NUMBER_OF_RESIDENTS] = this.numberOfResidents
        data[House.TOTAL_POINTS] = this.totalPoints
        data[House.FLOOR_IDS] = this.floorIds
        data[House.DOWNLOAD_URL] = this.downloadURL
        data[House.DESCRIPTION] = this.description
        return data
    }

    /**
     * get the minimaly sized JSON object required to update the total points in the database
     */
    toPointUpdateJson() {
        const data = {}
        data[House.TOTAL_POINTS] = this.totalPoints
        return data
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): House{
        return this.fromData(document.data()!, document.id)
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): House[]{
        const houses: House[] = []
        for(const document of snapshot.docs){
            houses.push(this.fromData(document.data(), document.id))
        }
        return houses
    }

    protected static fromData(document: FirebaseFirestore.DocumentData, doc_id: string): House{
        let color: string
        let numberOfResidents: number
        let totalPoints: number
        let floorIds: string[]
        let description: string
        let downloadURL: string
        const id = doc_id

        if( House.COLOR in document){
            color = document[House.COLOR];
        }
        else{
            color = "";
        }
        
        if( House.NUMBER_OF_RESIDENTS in document){
            numberOfResidents = document[House.NUMBER_OF_RESIDENTS];
        }
        else{
            numberOfResidents = -1;
        }

        if( House.TOTAL_POINTS in document){
            totalPoints = document[House.TOTAL_POINTS];
        }
        else{
            totalPoints = -1;
        }

        if(House.FLOOR_IDS in document){
            floorIds = document[House.FLOOR_IDS]
        }
        else{
            floorIds = []
        }

        if(House.DOWNLOAD_URL in document){
            downloadURL = document[House.DOWNLOAD_URL]
        }
        else{
            downloadURL = ""
        }

        if(House.DESCRIPTION in document){
            description = document[House.DESCRIPTION]
        }
        else{
            description = ""
        }

        return new House(color, numberOfResidents, totalPoints, floorIds, id, downloadURL, description)
    }
}


export class HouseWithPointLog extends House{
    pointLogs: PointLog[] = []

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): HouseWithPointLog[]{
        const houses: HouseWithPointLog[] = []
        for(const document of snapshot.docs){
            houses.push(this.fromData(document.data(), document.id) as HouseWithPointLog)
        }
        return houses
    }

}