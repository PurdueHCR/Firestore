import { UserPermissionLevel } from "./UserPermissionLevel"

export class HouseCode {

    static CODE = "Code"
    static CODE_NAME = "CodeName"
    static FLOOR_ID = "FloorId"
    static HOUSE = "House"
    static PERMISSION_LEVEL = "PermissionLevel"

    id:string
    code: string
    codeName: string
    floorId: string
    house: string
    permissionLevel: UserPermissionLevel
    

    constructor(id:string, code: string, codeName: string, floorId: string, house: string, permissionLevel: UserPermissionLevel){
        this.id = id
        this.code = code
        this.codeName = codeName
        this.floorId = floorId
        this.house = house
        this.permissionLevel = permissionLevel
    }

    static fromDocument(document: FirebaseFirestore.DocumentSnapshot): HouseCode {
        return this.fromData(document.id, document.data()!)
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.QueryDocumentSnapshot): HouseCode {
        return this.fromData(document.id, document.data())
    }

    private static fromData(doc_id: string, document: FirebaseFirestore.DocumentData):  HouseCode {
        let code: string
        let codeName: string
        let floorId: string
        let house: string
        let permissionLevel: UserPermissionLevel
        let id:string

        id = doc_id
        code = document[HouseCode.CODE]
        codeName = document[HouseCode.CODE_NAME]
        floorId = document[HouseCode.FLOOR_ID]
        house = document[HouseCode.HOUSE]
        permissionLevel =  document[HouseCode.PERMISSION_LEVEL]

        return new HouseCode(id, code, codeName, floorId, house, permissionLevel)
    }
}