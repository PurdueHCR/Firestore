import { UserPermissionLevel } from "./UserPermissionLevel"

export class HouseCode {

    static CODE = "Code"
    static CODE_NAME = "CodeName"
    static FLOOR_ID = "FloorId"
    static HOUSE = "House"
    static PERMISSION_LEVEL = "PermissionLevel"
    static DYNAMIC_LINK = "DynamicLink"

    id:string
    code: string
    codeName: string
    floorId: string
    house: string
    permissionLevel: UserPermissionLevel
    dynamicLink: string
    

    constructor(id:string, code: string, codeName: string, floorId: string, house: string, permissionLevel: UserPermissionLevel, dynamicLink:string){
        this.id = id
        this.code = code
        this.codeName = codeName
        this.floorId = floorId
        this.house = house
        this.permissionLevel = permissionLevel
        this.dynamicLink = dynamicLink
    }

    firestoreJson(){
        const data = {}
        data[HouseCode.CODE] = this.code
        data[HouseCode.CODE_NAME] = this.codeName
        data[HouseCode.FLOOR_ID] = this.floorId
        data[HouseCode.HOUSE] = this.house
        data[HouseCode.PERMISSION_LEVEL] = this.permissionLevel
        data[HouseCode.DYNAMIC_LINK] = this.dynamicLink
        return data
    }

    getUpdateCodeFirestoreJson(){
        const data = {}
        data[HouseCode.CODE] = this.code
        data[HouseCode.DYNAMIC_LINK] = this.dynamicLink
        return data
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): HouseCode {
        return this.fromData(document.id, document.data()!)
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): HouseCode[] {
        const codes: HouseCode[] = []
        for(const document of snapshot.docs){
            codes.push(this.fromData(document.id, document.data() ))
        }
        return codes
    }

    private static fromData(doc_id: string, document: FirebaseFirestore.DocumentData):  HouseCode {
        let code: string
        let codeName: string
        let floorId: string
        let house: string
        let permissionLevel: UserPermissionLevel
        let dynamicLink: string
        let id:string

        id = doc_id
        code = document[HouseCode.CODE]
        codeName = document[HouseCode.CODE_NAME]
        floorId = document[HouseCode.FLOOR_ID]
        house = document[HouseCode.HOUSE]
        permissionLevel =  document[HouseCode.PERMISSION_LEVEL]
        dynamicLink = document[HouseCode.DYNAMIC_LINK]

        return new HouseCode(id, code, codeName, floorId, house, permissionLevel, dynamicLink)
    }
}
