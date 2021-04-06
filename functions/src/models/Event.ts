export class Event {

    name: string
    details: string
    startDate: Date
    endDate: Date
    location: string
    virtualLink: string
    points: number
    pointTypeId: string
    pointTypeName: string
    pointTypeDescription: string
    floorIds: string[]
    floorColors: string[]
    creatorId: string
    claimedCount:number
    id: string
    host: string
    isPublicEvent: boolean

    constructor(name: string, details: string, startDate: Date, endDate: Date, location: string, 
                points: number, pointTypeId: string, pointTypeName:string,
                pointTypeDescription: string, floorIds: string[], creatorId: string, id: string, host: string,
                floorColors: string[], isPublicEvent:boolean, claimedCount:number, virtualLink: string) {
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
            this.floorColors = floorColors
            this.isPublicEvent = isPublicEvent
            this.claimedCount = claimedCount
            this.virtualLink = virtualLink
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
        const name: string = documentData.name
        const details: string = documentData.details
        const startDate: Date = documentData.startDate.toDate()
        const endDate: Date = documentData.endDate.toDate()
        const location: string = documentData.location
        const points: number = documentData.points
        const pointTypeId: string = documentData.pointTypeId
        const pointTypeName: string = documentData.pointTypeName
        const pointTypeDescription: string = documentData.pointTypeDescription
        const floorIds: string[] = documentData.floorIds
        const creatorId: string = documentData.creatorId
        const id = docId
        const host: string = documentData.host
        const floorColors: string[] = documentData.floorColors
        const isPublicEvent: boolean = documentData.isPublicEvent
        const claimedCount: number = documentData.claimedCount
        const virtualLink: string = documentData.virtualLink ? documentData.virtualLink : ""

        return new Event(name, details, startDate, endDate, location,
                        points, pointTypeId, pointTypeName,
                        pointTypeDescription, floorIds, creatorId, id, host, floorColors, isPublicEvent, claimedCount, virtualLink)
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

    /**
     * Get a map of fields to update for updating the claimed count
     * @returns firestore map
     */
    public getUpdateClaimedCountJson(){
        return {
            claimedCount:this.claimedCount
        }
    }
}