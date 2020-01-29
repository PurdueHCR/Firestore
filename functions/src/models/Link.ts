
export class Link {

    static ARCHIVED = "Archived";
    static CREATOR_ID = "CreatorID";
    static DESCRIPTION = "Description";
    static ENABLED = "Enabled";
    static POINT_ID = "PointID";
    static SINGLE_USE = "SingleUse"

    id: String
    archived: Boolean
    creatorId: String
    description: String
    enabled: Boolean
    pointId: number
    singleUse: Boolean

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot) {
        this.id = document.id;
        if(Link.ARCHIVED in document.data()) {
            this.archived = document.data()[Link.ARCHIVED];
        }
        else {
            this.archived = false
        }

        if(Link.CREATOR_ID in document.data()) {
            this.creatorId = document.data()[Link.CREATOR_ID];
        }
        else {
            this.creatorId = ""
        }

        if(Link.DESCRIPTION in document.data()) {
            this.description = document.data()[Link.DESCRIPTION];
        }
        else {
            this.description = ""
        }

        if(Link.ENABLED in document.data()) {
            this.enabled = document.data()[Link.ENABLED];
        }
        else {
            this.enabled = false;
        }

        if(Link.POINT_ID in document.data()) {
            this.pointId = document.data()[Link.POINT_ID];
        }
        else {
            this.pointId = -1;
        }

        if(Link.SINGLE_USE in document.data()) {
            this.singleUse = document.data()[Link.SINGLE_USE];
        }
        else {
            this.singleUse = false;
        }

    }
}