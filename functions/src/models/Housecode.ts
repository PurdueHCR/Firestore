
export class HouseCode {

    static CODE = "Code"
    static CODE_NAME = "CodeName"
    static FLOOR_ID = "FloorId"
    static HOUSE = "House"
    static PERMISSION_LEVEL = "PermissionLevel"

    code: String
    codeName: String
    floorId: String
    house: String
    permissionLevel: number
    id:String

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;
        
        if( HouseCode.CODE in document.data()) {
            this.code = document.data()[HouseCode.CODE];
        }
        else {
            this.code = "";
        }

        if( HouseCode.CODE_NAME in document.data()) {
            this.codeName = document.data()[HouseCode.CODE_NAME];
        }
        else {
            this.codeName = "";
        }

        if( HouseCode.FLOOR_ID in document.data()) {
            this.floorId = document.data()[HouseCode.FLOOR_ID];
        }
        else {
            this.floorId = "";
        }

        if( HouseCode.HOUSE in document.data()) {
            this.house = document.data()[HouseCode.HOUSE];
        }
        else {
            this.house = "";
        }

        if( HouseCode.PERMISSION_LEVEL in document.data()) {
            this.permissionLevel = document.data()[HouseCode.PERMISSION_LEVEL];
        }
        else {
            this.permissionLevel = -1;
        }

    }
}