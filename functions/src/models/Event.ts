
export class Event {

    static NAME = "Name"
    static DETAILS = "Details"
    static DATE = "Date"
    static LOCATION = "Location"
    static POINTS = "Points"
    static POINT_TYPE_ID = "PointTypeID"
    static POINT_TYPE_NAME = "PointTypeName"
    static POINT_TYPE_DESCRIPTION = "PointTypeDescription"
    static HOUSE = "House"
    static CREATOR_ID = "CreatorID"
    
    name: string
    details: string
    date: Date
    location: string
    points: number
    point_type_id: number
    point_type_name: string
    point_type_description: string
    house: string
    creator_id: string
    id: string

    constructor(name: string, details: string, date: Date, location: string, 
                points: number, point_type_id: number, point_type_name:string,
                point_type_description: string, house: string, creator_id: string, id: string) {
            this.name = name
            this.details = details
            this.date = date
            this.location = location
            this.points = points
            this.point_type_id = point_type_id
            this.point_type_name = point_type_name
            this.point_type_description = point_type_description
            this.house = house
            this.creator_id = creator_id
            this.id = id
        }

    /**
     * This method takes a querysnapshot that you get by retrieving a collection and turns it into a list of event model.
     * 
     * @param snapshot Querysnapshot that has DocumentData of Events
     * 
     * @returns event documents matching query
     */
    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): Event[] {
        const events: Event[] = []
        for (const document of snapshot.docs) {
            events.push(this.fromData(document.id, document.data()))
        }
        return events
    }

    /**
     * This method takes a document that you have after you call .get() on a document but not a collection
     * 
     * @param document Document retrived 
     * 
     * @returns document matching snapshot
     */
    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot) {
        return this.fromData(document.id, document.data()!)
    }

    /**
     * Turn a document and its data into an Event object
     * 
     * @param docId the ID of the document
     * @param documentData the data of the document
     * 
     * @returns the Event object from the data
     */
    static fromData(docId: string, documentData: FirebaseFirestore.DocumentData) {
        let name: string
        let details: string
        let date: Date
        let location: string
        let points: number
        let point_type_id: number
        let point_type_name: string
        let point_type_description: string
        let house: string
        let creator_id: string
        let id = docId

        if (Event.NAME in documentData) {
            name = documentData[Event.NAME]
        } else {
            name = ""
        }
        if (Event.DETAILS in documentData) {
            details = documentData[Event.DETAILS]
        } else {
            details = ""
        }
        if (Event.DATE in documentData) {
            date = documentData[Event.DATE]
        } else {
            date = new Date()
        }
        if (Event.LOCATION in documentData) {
            location = documentData[Event.LOCATION]
        } else {
            location = ""
        }
        if (Event.POINTS in documentData) {
            points = documentData[Event.POINTS]
        } else {
            points = -1
        }
        if (Event.POINT_TYPE_ID in documentData) {
            point_type_id = documentData[Event.POINT_TYPE_ID]
        } else {
            point_type_id = -1
        }
        if (Event.POINT_TYPE_NAME in documentData) {
            point_type_name = documentData[Event.POINT_TYPE_NAME]
        } else {
            point_type_name = ""
        }
        if (Event.POINT_TYPE_DESCRIPTION in documentData) {
            point_type_description = documentData[Event.POINT_TYPE_DESCRIPTION]
        } else {
            point_type_description = ""
        }
        if (Event.HOUSE in documentData) {
            house = documentData[Event.HOUSE]
        } else {
            house = ""
        }
        if (Event.CREATOR_ID in documentData) {
            creator_id = document[Event.CREATOR_ID]
        } else {
            creator_id = ""
        }

        return new Event(name, details, date, location,
                        points, point_type_id, point_type_name,
                        point_type_description, house, creator_id, id)
    }

    /**
     * Convert an event object into a Firebase-compatible dictionary
     * 
     * @returns a dictionary of the object's data
     */
    toFirestoreJson() {
        const data = {}
        data[Event.NAME] = this.name
        data[Event.DETAILS] = this.details
        data[Event.DATE] = this.date
        data[Event.LOCATION] = this.location
        data[Event.POINTS] = this.points
        data[Event.POINT_TYPE_ID] = this.point_type_id
        data[Event.POINT_TYPE_NAME] = this.point_type_name
        data[Event.POINT_TYPE_DESCRIPTION] = this.point_type_description
        data[Event.HOUSE] = this.house
        data[Event.CREATOR_ID] = this.creator_id

        return data
    }
}