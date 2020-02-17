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

    static houseFromFirebaseDoc(document: FirebaseFirestore.QueryDocumentSnapshot){
        let color: string
        let numberOfResidents: number
        let totalPoints: number
        const id = document.id

        if( House.COLOR in document.data()){
            color = document.data()[House.COLOR];
        }
        else{
            color = "";
        }
        
        if( House.NUMBER_OF_RESIDENTS in document.data()){
            numberOfResidents = document.data()[House.NUMBER_OF_RESIDENTS];
        }
        else{
            numberOfResidents = -1;
        }

        if( House.TOTAL_POINTS in document.data()){
            totalPoints = document.data()[House.TOTAL_POINTS];
        }
        else{
            totalPoints = -1;
        }
        return new House(color, numberOfResidents, totalPoints, id)
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