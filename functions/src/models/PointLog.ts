import * as admin from "firebase-admin"
import { User } from "./User"
import { PointType } from "./PointType"

export class PointLog {
    static APPROVED_BY = "ApprovedBy"
    static APPROVED_ON = "ApprovedOn"
    static DATE_OCCURRED = "DateOccurred"
    static DATE_SUBMITTED = "DateSubmitted"
    static DESCRIPTION = "Description"
    static FLOOR_ID = "FloorID"
    static POINT_TYPE_ID = "PointTypeID"
    static POINT_TYPE_NAME = "PointTypeName"
    static POINT_TYPE_DESCRIPTION = "PointTypeDescription"
    static RHP_NOTIFICATIONS = "RHPNotifications"
    static RESIDENT_FIRST_NAME = "ResidentFirstName"
    static RESIDENT_ID = "ResidentId"
    static RESIDENT_LAST_NAME = "ResidentLastName"
    static RESIDENT_NOTIFICATIONS = "ResidentNotifications"

    static PREAPPROVED_NAME = "Preapproved"

    //Approved variables may not be filled if the point log has not been approved yet, so the type is unified with null
    approvedBy: string | null
    approvedOn: Date | null

    dateOccurred: Date
    dateSubmitted: Date
    description: string
    floorId: string
    pointTypeDescription: string
    pointTypeId: number
    pointTypeName: string
    rhpNotifications: number
    residentFirstName: string
    residentId: string
    residentLastName: string
    residentNotifications: number
    id: string

    constructor(id:string, approvedBy: string | null, approvedOn: Date | null, dateOccurred: Date,
        dateSubmitted: Date, description: string, floorId: string, pointTypeDescription:string, pointTypeId: number, pointTypeName:string,
        rhpNotifications: number, residentFirstName: string, residentId: string, residentLastName: string,
        residentNotifications: number) {
        this.id = id
        this.approvedBy = approvedBy
        this.approvedOn = approvedOn
        this.dateOccurred = dateOccurred
        this.dateSubmitted = dateSubmitted
        this.description = description
        this.floorId = floorId
        this.pointTypeDescription = pointTypeDescription
        this.pointTypeId = pointTypeId
        this.pointTypeName = pointTypeName
        this.rhpNotifications = rhpNotifications
        this.residentFirstName = residentFirstName
        this.residentId = residentId
        this.residentLastName = residentLastName
        this.residentNotifications = residentNotifications
    }

    updateFieldsWithUser(user: User){
        this.floorId = user.floorId.toString()
        this.residentFirstName = user.firstName.toString()
        this.residentLastName = user.lastName.toString()
        this.residentId = user.id.toString()
    }

    updateFieldsWithPointType(type:PointType) {
        this.pointTypeName = type.name.toString()
        this.pointTypeDescription = type.description.toString()
    }

    /**
     * Set the approved fields in the point log
     * 
     * @param approvingUser (optional) information about the user who approved the log. If null, then preapproved
     */
    approveLog(approvingUser?: User | null){
        if(approvingUser){
            this.approvedBy = approvingUser.getFullName()
        }
        else {
            this.approvedBy = PointLog.PREAPPROVED_NAME
        }
        this.approvedOn = new Date(Date.now())

        //Ensure that the point type id is positive. Negative implies the log is not approved yet
        this.pointTypeId = Math.abs(this.pointTypeId)

        this.residentNotifications = 1
    }

    /**
     * Set the PointTypeID field in the point log
     * 
     * @param newPointType the new point type for the log
     */
    updatePointTypeId(newPointType: number) {
        this.pointTypeId = newPointType
    }

    static fromDocumentSnapshot( document: admin.firestore.DocumentSnapshot): PointLog {
        return this.fromData(document.data()!, document.id);
    }

    static fromQuerySnapshot( snapshot: admin.firestore.QuerySnapshot): PointLog[] {
        const pointLogs: PointLog[] = []
        for( const document of snapshot.docs){
            pointLogs.push(this.fromData(document.data(), document.id))
        }
        return pointLogs;
    }

    private static fromData(document: admin.firestore.DocumentData, doc_id: string): PointLog {
        let approvedBy: string | null
        let approvedOn: Date | null
        let dateOccurred: Date
        let dateSubmitted: Date
        let description: string
        let floorId: string
        let pointTypeDescription: string
        let pointTypeId: number
        let pointTypeName: string
        let rhpNotifications: number
        let residentFirstName: string
        let residentId: string
        let residentLastName: string
        let residentNotifications: number
        let id: string

        id = doc_id

        if(PointLog.APPROVED_BY in document){
            approvedBy = document[PointLog.APPROVED_BY]
        }
        else{
            approvedBy = null
        }

        if(PointLog.APPROVED_ON in document){
            approvedOn = document[PointLog.APPROVED_ON]
        }
        else{
            approvedOn = null
        }

        //These fields have to exist on a point log, so there is no check for null.
        dateOccurred = document[PointLog.DATE_OCCURRED]
        dateSubmitted = document[PointLog.DATE_SUBMITTED]
        description = document[PointLog.DESCRIPTION]
        floorId = document[PointLog.FLOOR_ID]
        pointTypeDescription = document[PointLog.POINT_TYPE_DESCRIPTION]
        pointTypeId = document[PointLog.POINT_TYPE_ID]
        pointTypeName = document[PointLog.POINT_TYPE_NAME]
        rhpNotifications = document[PointLog.RHP_NOTIFICATIONS]
        residentFirstName = document[PointLog.RESIDENT_FIRST_NAME]
        residentId = document[PointLog.RESIDENT_ID]
        residentLastName = document[PointLog.RESIDENT_LAST_NAME]
        residentNotifications = document[PointLog.RESIDENT_NOTIFICATIONS]

        return new PointLog(id, approvedBy, approvedOn, dateOccurred, dateSubmitted, description, floorId, pointTypeDescription, pointTypeId, pointTypeName,
            rhpNotifications, residentFirstName, residentId, residentLastName, residentNotifications)

    }

    toFirebaseJSON() {
        const data = {}
        if(this.approvedBy){
            data[PointLog.APPROVED_BY] = this.approvedBy
            data[PointLog.APPROVED_ON] = this.approvedOn
        }        
        data[PointLog.DATE_OCCURRED] = this.dateOccurred
        data[PointLog.DATE_SUBMITTED] = this.dateSubmitted
        data[PointLog.DESCRIPTION] = this.description
        data[PointLog.FLOOR_ID] = this.floorId
        data[PointLog.POINT_TYPE_DESCRIPTION] = this.pointTypeDescription
        data[PointLog.POINT_TYPE_ID] = this.pointTypeId
        data[PointLog.POINT_TYPE_NAME] = this.pointTypeName
        data[PointLog.RHP_NOTIFICATIONS] = this.rhpNotifications
        data[PointLog.RESIDENT_FIRST_NAME]  = this.residentFirstName
        data[PointLog.RESIDENT_ID] = this.residentId
        data[PointLog.RESIDENT_LAST_NAME] = this.residentLastName
        data[PointLog.RESIDENT_NOTIFICATIONS]  = this.residentNotifications
        return data
    }

}
