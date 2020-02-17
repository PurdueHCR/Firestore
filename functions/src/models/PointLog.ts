import { UserWithPoints } from "./User"

export class PointLog {
    static POINT_TYPE_ID = "PointTypeID"
    static RESIDENT_FIRST_NAME = "ResidentFirstName"
    static RESIDENT_LAST_NAME = "ResidentLastName"
    static RESIDENT_ID = "ResidentId"

    pointTypeId: number
    residentFirstName: String
    residentLastName: String
    residentId: String

    constructor( document: FirebaseFirestore.QueryDocumentSnapshot) {
        this.pointTypeId = document.data()[PointLog.POINT_TYPE_ID]
        this.residentFirstName = document.data()[PointLog.RESIDENT_FIRST_NAME]
        this.residentLastName = document.data()[PointLog.RESIDENT_LAST_NAME]
        this.residentId = document.data()[PointLog.RESIDENT_ID]
    }

    createUser(){
        const usr = new UserWithPoints(this.residentFirstName, "","",this.residentLastName,0,0,0,this.residentId)
        usr.addPointLog(this)
        return usr;
    }
}
