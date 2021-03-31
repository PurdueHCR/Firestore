import * as admin from 'firebase-admin'
import { Event } from '../models/Event'

import { HouseCompetition } from '../models/HouseCompetition'
export class EventFunctions{
    /**
     * Take the data in the provided event and update the event on the server with event.id with the values in the provided event
     * @param event Event to update with all fields set to the correct value
     */
    static async updateEvent(event:Event){
        const db = admin.firestore()
        await db.collection(HouseCompetition.EVENTS_KEY).doc(event.id).update(event.toFirestoreJson())
    }
}