import * as admin from 'firebase-admin'
import { Event } from '../models/Event'
import { HouseCompetition } from '../models/HouseCompetition'

/**
 * Delete the provided event
 * 
 * @param event the id of the user requesting events
 * 
 */
export async function deleteEvent(event:Event){

    const db = admin.firestore()
    await db.collection(HouseCompetition.EVENTS_KEY).doc(event.id).delete()
}