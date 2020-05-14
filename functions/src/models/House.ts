import { UserWithPoints } from "./User"
import { PointLog } from "./PointLog"

export class House {

    static COLOR = "Color"
    static NUMBER_OF_RESIDENTS = "NumberOfResidents"
    static TOTAL_POINTS =  "TotalPoints"

    color: string
    numberOfResidents: number
    totalPoints: number
    id:string

    constructor(color:string, numberOfResidents: number, totalPoints: number, id: string){
        this.color = color
        this.numberOfResidents = numberOfResidents
        this.totalPoints = totalPoints
        this.id = id
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): House{
        return this.fromData(document.data()!)
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): House[]{
        const houses: House[] = []
        for(const document of snapshot.docs){
            houses.push(this.fromData(document.data()))
        }
        return houses
    }

    private static fromData(document: FirebaseFirestore.DocumentData): House{
        let color: string
        let numberOfResidents: number
        let totalPoints: number
        const id = document.id

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
        return new House(color, numberOfResidents, totalPoints, id)
    }

    toPointUpdateJson() {
        const data = {}
        data[House.TOTAL_POINTS] = this.totalPoints
        return data
    }
}

export class HouseWithUser extends House {
    users: UserWithPoints[] = []

    getUser(id:string){
        let i = 0;
        while( i < this.users.length){
            if(this.users[i].id === id){
                return this.users[i]
            }
            i++
        }

        return null
    }

    addUser(pl:PointLog){
        this.users.push(pl.createUser())
    }
}