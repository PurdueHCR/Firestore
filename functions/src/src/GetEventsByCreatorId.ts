import * as admin from 'firebase-admin'
import { Event } from '../models/Event'
import { HouseCompetition } from '../models/HouseCompetition'

/**
 * This function returns the events created by the user with given id
 * 
 * @param creator_id id of the user that created the events
 * 
 * @throws 500 - Server Error
 * 
 * @returns an array of events created by the user
 */
export async function getEventsByCreatorId(creator_id: string): Promise<Event[]> {

    const db = admin.firestore()
    
    const events = await db.collection(HouseCompetition.EVENTS_KEY).where('creator_id', '==', creator_id).get()
    const event_objs = Event.fromQuerySnapshot(events)
    return Promise.resolve(event_objs)

}