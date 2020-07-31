import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { Event } from '../models/Event'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseCompetition } from '../models/HouseCompetition'

//REC and someone else should see all events. otherwise only see the events to your house

/**
 * This function returns all events available to the user
 * 
 * @param user_id the id of the user requesting events
 * 
 * @throws 500 - Server Error
 * 
 * @returns an array of events
 */
export async function getEvents(user: User): Promise<Event[]> {

    const db = admin.firestore()
    if (user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF) {
        // Professional staff should see all events
        const events = Event.fromQuerySnapshot(await db.collection(HouseCompetition.EVENTS_KEY).get())
        return Promise.resolve(events)
    } else {
        const eventsSnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('House', 'in', [user.house, "All Houses"]).get()
        const events = Event.fromQuerySnapshot(eventsSnapshot)
        return Promise.resolve(events)
       
    }

}