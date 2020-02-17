import { PointLog} from './PointLog'
import { HouseCode } from './Housecode'
export class User {

    static FIRST_NAME = "FirstName"
    static FLOOR_ID ="FloorID"
    static HOUSE = "House"
    static LAST_NAME = "LastName"
    static PERMISSION_LEVEL = "Permission Level"
    static LAST_SEMESTER_POINTS = "LastSemesterPoints"
    static TOTAL_POINTS = "TotalPoints"

    firstName: String
    floorId: String
    house: String
    lastName: String
    lastSemesterPoints: number
    permissionLevel: number
    totalPoints: number
    id: String

    constructor(firstName:String, floorId:String, house: String, lastName: String, 
        lastSemesterPoints: number, permissionLevel: number, totalPoints: number, id:String){
            this.firstName = firstName
            this.floorId = floorId
            this.house = house
            this.lastName = lastName
            this.lastSemesterPoints = lastSemesterPoints
            this.permissionLevel = permissionLevel
            this.totalPoints = totalPoints
            this.id = id
        }

    public static fromCode(firstName: String, lastName: String, id: String, code:HouseCode){
        return new User(firstName,code.floorId, code.house, lastName, 0, code.permissionLevel, 0, id)
    } 

    static fromDocument(document: FirebaseFirestore.QueryDocumentSnapshot){
        let firstName: String
        let floorId: String
        let house: String
        let lastName: String
        let lastSemesterPoints: number
        let permissionLevel: number
        let totalPoints: number
        let id: String

        id = document.id;


        if( User.FIRST_NAME in document.data()){
            firstName = document.data()[User.FIRST_NAME];
        }
        else{
            firstName = "";
        }
        
        if( User.FLOOR_ID in document.data()){
            floorId = document.data()[User.FLOOR_ID];
        }
        else{
            floorId = "";
        }

        if( User.HOUSE in document.data()){
            house = document.data()[User.HOUSE];
        }
        else{
            house = "";
        }
        
        if( User.LAST_NAME in document.data()){
            lastName = document.data()[User.LAST_NAME];
        }
        else{
            lastName = "";
        }
        
        if( User.LAST_SEMESTER_POINTS in document.data()){
            lastSemesterPoints = document.data()[User.LAST_SEMESTER_POINTS];
        }
        else{
            lastSemesterPoints = -1;
        }

        if( User.PERMISSION_LEVEL in document.data()){
            permissionLevel = document.data()[User.PERMISSION_LEVEL];
        }
        else{
            permissionLevel = -1;
        }
        
        if( User.TOTAL_POINTS in document.data()){
            totalPoints = document.data()[User.TOTAL_POINTS];
        }
        else{
            totalPoints = -1;
        }
        return new User(firstName,floorId,house,lastName
            ,lastSemesterPoints,permissionLevel,totalPoints,id)
    }

    toFirestoreJson(){
        const data = {}
        data[User.FIRST_NAME]= this.firstName
        data[User.FLOOR_ID] = this.floorId
        data[User.HOUSE] = this.house
        data[User.LAST_NAME] = this.lastName
        data[User.PERMISSION_LEVEL] = this.permissionLevel
        data[User.TOTAL_POINTS] = this.totalPoints
        data[User.LAST_SEMESTER_POINTS] = this.lastSemesterPoints
        
        return data;
    }


    toJson(){
        const data = {}
        data[User.FIRST_NAME]= this.firstName
        data[User.FLOOR_ID] = this.floorId
        data[User.HOUSE] = this.house
        data[User.LAST_NAME] = this.lastName
        data[User.PERMISSION_LEVEL] = this.permissionLevel
        data[User.TOTAL_POINTS] = this.totalPoints
        data[User.LAST_SEMESTER_POINTS] = this.lastSemesterPoints
        data["id"] = this.id
        
        return data;
    }

}

export class UserWithPoints extends User {
    points: PointLog[] = []

    addPointLog(pl:PointLog){
        this.points.push(pl)
    }
}