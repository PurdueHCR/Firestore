
export class Link {

    static ARCHIVED = "Archived";
    static CREATOR_ID = "CreatorID";
    static DESCRIPTION = "Description";
    static ENABLED = "Enabled";
    static POINT_ID = "PointID";
    static SINGLE_USE = "SingleUse"
    static POINT_TYPE_NAME = "PointTypeName";
    static POINT_TYPE_DESCRIPTION = "PointTypeDescription"
    static POINT_TYPE_VALUE = "PointTypeValue"

    id: String
    archived: Boolean
    creatorId: String
    description: String
    enabled: Boolean
    pointId: number
    pointTypeName: String
    pointTypeDescription: String
    pointTypeValue: number
    singleUse: Boolean

    constructor(id: String, archived: Boolean, creatorId: String, description: String, 
        enabled: Boolean, pointId: number, pointTypeName: String, pointTypeDescription: String, pointTypeValue: number, singleUse: Boolean){
        this.id = id
        this.archived = archived
        this.creatorId = creatorId
        this.description = description
        this.enabled = enabled
        this.pointId = pointId
        this.singleUse = singleUse
        this.pointTypeName = pointTypeName
        this.pointTypeDescription = pointTypeDescription
        this.pointTypeValue = pointTypeValue
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
        map[Link.POINT_TYPE_DESCRIPTION] = this.pointTypeDescription
        map[Link.POINT_TYPE_VALUE] = this.pointTypeValue
        return map;
    }
    

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
        let pointTypeDescription: String
        let pointTypeValue: number
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

        if(Link.POINT_TYPE_DESCRIPTION in document) {
            pointTypeDescription = document[Link.POINT_TYPE_DESCRIPTION]
        }
        else{
            pointTypeDescription = "Undefined"
        }

        if(Link.POINT_TYPE_VALUE in document) {
            pointTypeValue = document[Link.POINT_TYPE_VALUE]
        }
        else{
            pointTypeValue = -1
        }

        return new Link(id, archived, creatorId, description, enabled, pointId, pointTypeName, pointTypeDescription, pointTypeValue, singleUse);
    }
}