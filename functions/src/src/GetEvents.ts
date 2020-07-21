import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { Event } from '../models/Event'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'

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

    try {
        const db = admin.firestore()
        if (user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF) {
            // Professional staff should see all events
            const events = Event.fromQuerySnapshot(await db.collection(HouseCompetition.EVENTS_KEY).get())
            console.log("These are the events", events)
            return Promise.resolve(events)
        } else {
            const events = Event.fromQuerySnapshot(await db.collection(HouseCompetition.EVENTS_KEY).where('House', 'in', [user.house, "All Houses"]).get())
            console.log("These are the events", events)
            return Promise.resolve(events)
        }
    } catch (error) {
        console.error(error)
        return Promise.reject(APIResponse.ServerError())
    }

}