import { UserPermissionLevel } from "./UserPermissionLevel"
import {LinkCreatablePermissionLevel} from "./LinkCreatablePermissionLevel"

export class PointType{

    static DESCRIPTION = "Description"
    static ENABLED = "Enabled"
    static NAME = "Name"
    static PERMISSION_LEVEL = "PermissionLevel"
    static RESIDENTS_CAN_SUBMIT = "ResidentsCanSubmit"
    static VALUE = "Value"

    id: string
    description: string
    enabled: Boolean
    name: string
    permissionLevel: LinkCreatablePermissionLevel
    residentCanSubmit: Boolean
    value: number

    constructor(id: string, description: string, enabled: Boolean, name: string, permissionLevel: LinkCreatablePermissionLevel,
         residentsCanSubmit: Boolean, value: number){
            this.id = id;
            this.description = description;
            this.enabled = enabled;
            this.name = name;
            this.permissionLevel = permissionLevel;
            this.residentCanSubmit = residentsCanSubmit;
            this.value = value;
    }

    firestoreJson(){
        const data = {}
        data[PointType.DESCRIPTION] = this.description
        data[PointType.ENABLED] = this.enabled
        data[PointType.NAME] = this.name
        data[PointType.PERMISSION_LEVEL] = this.permissionLevel
        data[PointType.RESIDENTS_CAN_SUBMIT] = this.residentCanSubmit
        data[PointType.VALUE] = this.value
        return data
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): PointType[]{
        const types: PointType[] = []
        for( const document of snapshot.docs){
            types.push(this.fromData(document.id, document.data()))
        }
        return types;
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): PointType{
        return this.fromData(document.id, document.data()!);
    }

    /**
     * 
     * @param documentId Required because DocumentData.id is null
     * @param document 
     */
    private static fromData(documentId: string, document: FirebaseFirestore.DocumentData){
        const id = documentId;
        let  description = ""
        let enabled = false
        let name = ""
        let permissionLevel = 0
        let residentCanSubmit = false
        let value = 0

        if( PointType.DESCRIPTION in document) {
            description = document[PointType.DESCRIPTION];
        }
        else {
            description = ""
        }

        if( PointType.ENABLED in document) {
            enabled = document[PointType.ENABLED];
        }
        else {
            enabled = false
        }

        if( PointType.NAME in document) {
            name = document[PointType.NAME]
        }
        else {
            name = ""
        }

        if( PointType.PERMISSION_LEVEL in document) {
            permissionLevel = document[PointType.PERMISSION_LEVEL]
        }
        else {
            permissionLevel = -1
        }

        if( PointType.RESIDENTS_CAN_SUBMIT in document) {
            residentCanSubmit = document[PointType.RESIDENTS_CAN_SUBMIT]
        }
        else {
            residentCanSubmit = false
        }

        if( PointType.VALUE in document) {
            value = document[PointType.VALUE]
        }
        else {
            value = -1
        }
        return new PointType(id,description,enabled,name,permissionLevel,residentCanSubmit,value);
    }
    
    canUserGenerateLinks(userPermissionLevel: UserPermissionLevel){
        if(userPermissionLevel === UserPermissionLevel.RHP){
            return this.permissionLevel >= LinkCreatablePermissionLevel.RESIDENTIAL_STAFF_ONLY
        }
        else if (userPermissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
            return true
        }
        else if(userPermissionLevel === UserPermissionLevel.FACULTY){
            return this.permissionLevel === LinkCreatablePermissionLevel.ALL_LINK_CREATORS
        }
        else if (userPermissionLevel === UserPermissionLevel.PRIVILEGED_RESIDENT){
            return this.permissionLevel === LinkCreatablePermissionLevel.ALL_LINK_CREATORS
        }
        else if (userPermissionLevel === UserPermissionLevel.EXTERNAL_ADVISOR){
            return this.permissionLevel === LinkCreatablePermissionLevel.ALL_LINK_CREATORS
        }
        else {
            return false;
        }
    }
}