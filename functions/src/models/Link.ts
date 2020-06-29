
export class Link {

    static ARCHIVED = "Archived";
    static CREATOR_ID = "CreatorID";
    static DESCRIPTION = "Description";
    static ENABLED = "Enabled";
    static POINT_ID = "PointID";
    static SINGLE_USE = "SingleUse"
    static POINT_TYPE_NAME = "PointTypeName";

    id: String
    archived: Boolean
    creatorId: String
    description: String
    enabled: Boolean
    pointId: number
    pointTypeName: String
    singleUse: Boolean

    constructor(id: String, archived: Boolean, creatorId: String, description: String, 
        enabled: Boolean, pointId: number, pointTypeName: String, singleUse: Boolean){
        this.id = id
        this.archived = archived
        this.creatorId = creatorId
        this.description = description
        this.enabled = enabled
        this.pointId = pointId
        this.singleUse = singleUse
        this.pointTypeName = pointTypeName
    }

    public toFirebaseJson(){
        const map = {};
        map[Link.ARCHIVED] = this.archived;
        map[Link.CREATOR_ID] = this.creatorId;
        map[Link.DESCRIPTION] = this.description;
        map[Link.ENABLED] = this.enabled;
        map[Link.POINT_ID] = this.pointId;
        map[Link.SINGLE_USE] = this.singleUse;
        map[Link.POINT_TYPE_NAME] = this.pointTypeName;
        return map;
    }

    // public updateLinkFromData(data: any){
    //     if("is_archived" in data){
    //         this.archived = data["is_archived"]
    //     }
    //     if("is_enabled" in data){
    //         this.enabled = data["is_enabled"]
    //     }
    //     if("creator_id" in data){
    //         this.creatorId = data["creator_id"]
    //     }
    //     if("description" in data){
    //         this.description = data["description"]
    //     }
    //     if("point_id" in data){
    //         this.pointId = data["point_id"]
    //     }
    //     if("single_use" in data){
    //         this.singleUse = data["single_use"]
    //     }
    // }
    

    public static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): Link[] {
        const links: Link[] = []
        for( const document of snapshot.docs){
            links.push(this.fromDocumentData( document.id, document.data()))
        }
        return links;
    }

    public static fromSnapshotDocument(document: FirebaseFirestore.DocumentSnapshot): Link {
        
        return this.fromDocumentData(document.id, document.data()!)
    }

    private static fromDocumentData(docId: String, document: FirebaseFirestore.DocumentData) : Link{
        let id: String
        let archived: Boolean
        let creatorId: String
        let description: String
        let enabled: Boolean
        let pointId: number
        let pointTypeName: String
        let singleUse: Boolean

        id = docId;
        if(Link.ARCHIVED in document) {
            archived = document[Link.ARCHIVED];
        }
        else {
            archived = false
        }

        if(Link.CREATOR_ID in document) {
            creatorId = document[Link.CREATOR_ID];
        }
        else {
            creatorId = ""
        }

        if(Link.DESCRIPTION in document) {
            description = document[Link.DESCRIPTION];
        }
        else {
            description = ""
        }

        if(Link.ENABLED in document) {
            enabled = document[Link.ENABLED];
        }
        else {
            enabled = false;
        }

        if(Link.POINT_ID in document) {
            pointId = document[Link.POINT_ID];
        }
        else {
            pointId = -1;
        }

        if(Link.SINGLE_USE in document) {
            singleUse = document[Link.SINGLE_USE];
        }
        else {
            singleUse = false;
        }

        if(Link.POINT_TYPE_NAME in document) {
            pointTypeName = document[Link.POINT_TYPE_NAME]
        }
        else{
            pointTypeName = "Undefined"
        }

        return new Link(id, archived, creatorId, description, enabled, pointId, pointTypeName, singleUse);
    }
}