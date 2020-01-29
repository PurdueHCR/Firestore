
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

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;

        if( User.FIRST_NAME in document.data()){
            this.firstName = document.data()[User.FIRST_NAME];
        }
        else{
            this.firstName = "";
        }
        
        if( User.FLOOR_ID in document.data()){
            this.floorId = document.data()[User.FLOOR_ID];
        }
        else{
            this.floorId = "";
        }

        if( User.HOUSE in document.data()){
            this.house = document.data()[User.HOUSE];
        }
        else{
            this.house = "";
        }
        
        if( User.LAST_NAME in document.data()){
            this.lastName = document.data()[User.LAST_NAME];
        }
        else{
            this.lastName = "";
        }
        
        if( User.LAST_SEMESTER_POINTS in document.data()){
            this.lastSemesterPoints = document.data()[User.LAST_SEMESTER_POINTS];
        }
        else{
            this.lastSemesterPoints = -1;
        }

        if( User.PERMISSION_LEVEL in document.data()){
            this.permissionLevel = document.data()[User.PERMISSION_LEVEL];
        }
        else{
            this.permissionLevel = -1;
        }
        
        if( User.TOTAL_POINTS in document.data()){
            this.totalPoints = document.data()[User.TOTAL_POINTS];
        }
        else{
            this.totalPoints = -1;
        }
        
    }
}