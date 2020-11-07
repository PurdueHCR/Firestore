export class Event {

    name: string
    details: string
    startDate: Date
    endDate: Date
    location: string
    points: number
    pointTypeId: string
    pointTypeName: string
    pointTypeDescription: string
    floorIds: string[]
    creatorId: string
    id: string
    host: string

    constructor(name: string, details: string, startDate: Date, endDate: Date, location: string, 
                points: number, pointTypeId: string, pointTypeName:string,
                pointTypeDescription: string, floorIds: string[], creatorId: string, id: string, host: string) {
            this.name = name
            this.details = details
            this.startDate = startDate
            this.endDate = endDate
            this.location = location
            this.points = points
            this.pointTypeId = pointTypeId
            this.pointTypeName = pointTypeName
            this.pointTypeDescription = pointTypeDescription
            this.floorIds = floorIds
            this.creatorId = creatorId
            this.id = id
            this.host = host
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
        let name: string = documentData.name
        let details: string = documentData.details
        let startDate: Date = documentData.startDate
        let endDate: Date = documentData.endDate
        let location: string = documentData.location
        let points: number = documentData.points
        let pointTypeId: string = documentData.pointTypeId
        let pointTypeName: string = documentData.pointTypeName
        let pointTypeDescription: string = documentData.pointTypeDescription
        let floorIds: string[] = documentData.floorIds
        let creatorId: string = documentData.creatorId
        const id = docId
        let host: string = documentData.host

        return new Event(name, details, startDate, endDate, location,
                        points, pointTypeId, pointTypeName,
                        pointTypeDescription, floorIds, creatorId, id, host)
    }

    /**
     * Convert an event object into a Firebase-compatible dictionary
     * 
     * @returns a dictionary of the object's data
     */
    toFirestoreJson() {
        const data = Object.assign({}, this) as any
        delete data.id;
        return data
    }
}