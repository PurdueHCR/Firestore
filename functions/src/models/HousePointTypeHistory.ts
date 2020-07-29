///-----------------------------------------------------------------
///   Description:    Model that holds the count of each point type for a house. In the database, it is in Houses/<House_id>/Details/PointTypes but is a map, so we convert it to an array here
///   Author:         Brian Johncox                    Date: 7/27/2020
///   Notes:          
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------
export class HousePointTypeHistory{

    housePointTypes: HousePointType[]

    constructor(housePointTypes: HousePointType[]){
        this.housePointTypes = housePointTypes
    }

    /**
     * Takes the House/Details/PointType document and formates it as an array.
     * In Firestore the format is actually a map with keys being point type ids and the value being a map of the fields, 
     * but to make it more usable, we convert it into an array. 
     * @param document House Details PointType document to convert into a formatted History object
     */
    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot):HousePointTypeHistory {
        const housePointTypes: HousePointType[] = []
        if(document.exists){
            //Convert the map of <id:PointType> to an array and sort by id
            Object.keys(document.data()!).forEach((key:string)=>{
                const doc = document.data()![key]
                housePointTypes.push(new HousePointType(parseInt(key), doc.name, doc.submitted, doc.approved))
            })
            housePointTypes.sort((a,b) => a.id - b.id)
        }
        return new HousePointTypeHistory(housePointTypes)
    }
}

export class HousePointType{
    id: number
    name: string
    submitted: number
    approved: number

    constructor(id:number, name:string, submitted:number, approved: number){
        this.id = id
        this.name = name
        this.submitted = submitted
        this.approved = approved
    }
}