import { PointLog} from './PointLog'
import { HouseCode } from './HouseCode'
import { UserPermissionLevel } from './UserPermissionLevel'
export class User {

    static FIRST_NAME = "FirstName"
    static FLOOR_ID ="FloorID"
    static HOUSE = "House"
    static LAST_NAME = "LastName"
    static PERMISSION_LEVEL = "Permission Level"
    static SEMESTER_POINTS = "SemesterPoints"
    static TOTAL_POINTS = "TotalPoints"
    static ENABLED = "Enabled"

    firstName: string
    floorId: string
    house: string
    lastName: string
    semesterPoints: number
    permissionLevel: UserPermissionLevel
    totalPoints: number
    enabled:boolean
    id: string

    constructor(firstName:string, floorId:string, house: string, lastName: string, 
        semesterPoints: number, permissionLevel: UserPermissionLevel, totalPoints: number, enabled:boolean, id:string){
            this.firstName = firstName
            this.floorId = floorId
            this.house = house
            this.lastName = lastName
            this.semesterPoints = semesterPoints
            this.permissionLevel = permissionLevel
            this.totalPoints = totalPoints
            this.enabled = enabled
            this.id = id
        }

    static fromCode(firstName: string, lastName: string, id: string, code:HouseCode){
        return new User(firstName,code.floorId, code.house, lastName, 0, code.permissionLevel, 0, true, id)
    } 

    getFullName(): string {
        return this.firstName + " " + this.lastName
    }

    getSemesterUpdate(){
        const data = {}
        data[User.SEMESTER_POINTS] = 0
        return data
    }

    /**
     * Returns true if the user is Resident, RHP, or Priv_res. So, people who can submit points and have rank
     */
    isParticipantInCompetition(): Boolean {
        return this.permissionLevel === UserPermissionLevel.RESIDENT || 
            this.permissionLevel === UserPermissionLevel.RHP || 
            this.permissionLevel === UserPermissionLevel.PRIVILEGED_RESIDENT
    }

    /**
     * This method takes a querysnapshot that you get by retrieving a collection and turns it into a list of user model.
     * 
     * @param snapshot Querysnapshot that has DocumentData of Users
     */
    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): User[]{
        const users: User[] = []
        for(const document of snapshot.docs){
            users.push(this.fromData(document.id, document.data()))
        }
        return users
    }

    /**
     * This method takes a document that you have after you call .get() on a document but not a collection
     * 
     * @param document Document retrived 
     */
    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot){
        return this.fromData(document.id, document.data()!)
    }

    static fromData( docId: string, documentData: FirebaseFirestore.DocumentData){
        let firstName: string
        let floorId: string
        let house: string
        let lastName: string
        let semesterPoints: number
        let permissionLevel: UserPermissionLevel
        let totalPoints: number
        let enabled: boolean
        let id: string

        id = docId


        if( User.FIRST_NAME in documentData){
            firstName = documentData[User.FIRST_NAME]
        }
        else{
            firstName = ""
        }
        
        if( User.FLOOR_ID in documentData){
            floorId = documentData[User.FLOOR_ID]
        }
        else{
            floorId = ""
        }

        if( User.HOUSE in documentData){
            house = documentData[User.HOUSE]
        }
        else{
            house = ""
        }
        
        if( User.LAST_NAME in documentData){
            lastName = documentData[User.LAST_NAME]
        }
        else{
            lastName = ""
        }
        
        if( User.SEMESTER_POINTS in documentData){
            semesterPoints = documentData[User.SEMESTER_POINTS]
        }
        else{
            semesterPoints = 0
        }

        if( User.PERMISSION_LEVEL in documentData){
            permissionLevel = documentData[User.PERMISSION_LEVEL]
        }
        else{
            permissionLevel = 0
        }
        
        if( User.TOTAL_POINTS in documentData){
            totalPoints = documentData[User.TOTAL_POINTS]
        }
        else{
            totalPoints = 0
        }

        if( User.ENABLED in documentData){
            enabled = documentData[User.ENABLED]
        }
        else{
            enabled = true
        }

        return new User(firstName,floorId,house,lastName
            ,semesterPoints,permissionLevel,totalPoints,enabled, id)
    }

    toFirestoreJson(){
        const data = {}
        data[User.FIRST_NAME]= this.firstName
        data[User.FLOOR_ID] = this.floorId
        data[User.HOUSE] = this.house
        data[User.LAST_NAME] = this.lastName
        data[User.PERMISSION_LEVEL] = this.permissionLevel
        data[User.TOTAL_POINTS] = this.totalPoints
        data[User.SEMESTER_POINTS] = this.semesterPoints
        data[User.ENABLED] = this.enabled
        
        return data
    }

    /// This method returns a map with the data used to update the users overall score
    toPointUpdateJson() {
        const data = {}
        data[User.TOTAL_POINTS] = this.totalPoints
        data[User.SEMESTER_POINTS] = this.semesterPoints
        return data
    }

    toString() : string {
        return `${this.firstName} ${this.lastName} has permission of ${this.permissionLevel}`
    }

}

export class UserWithPoints extends User {
    points: PointLog[] = []

    addPointLog(pl:PointLog){
        this.points.push(pl)
    }
}


