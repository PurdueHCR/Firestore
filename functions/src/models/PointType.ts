export class PointType{

    static DESCRIPTION = "Description"
    static ENABLED = "Enabled"
    static NAME = "Name"
    static PERMISSION_LEVEL = "PermissionLevel"
    static RESIDENTS_CAN_SUBMIT = "ResidentsCanSubmit"
    static VALUE = "Value"

    id: String
    description: String
    enabled: Boolean
    name: String
    permissionLevel: number
    residentCanSubmit: Boolean
    value: number

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;

        if( PointType.DESCRIPTION in document.data()) {
            this.description = document.data()[PointType.DESCRIPTION];
        }
        else {
            this.description = ""
        }

        if( PointType.ENABLED in document.data()) {
            this.enabled = document.data()[PointType.ENABLED];
        }
        else {
            this.enabled = false
        }

        if( PointType.NAME in document.data()) {
            this.name = document.data()[PointType.NAME]
        }
        else {
            this.name = ""
        }

        if( PointType.PERMISSION_LEVEL in document.data()) {
            this.permissionLevel = document.data()[PointType.PERMISSION_LEVEL]
        }
        else {
            this.permissionLevel = -1
        }

        if( PointType.RESIDENTS_CAN_SUBMIT in document.data()) {
            this.residentCanSubmit = document.data()[PointType.RESIDENTS_CAN_SUBMIT]
        }
        else {
            this.residentCanSubmit = false
        }

        if( PointType.VALUE in document.data()) {
            this.value = document.data()[PointType.VALUE]
        }
        else {
            this.value = -1
        }

    }
}