import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { Event } from '../models/Event'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { verifyUserHasCorrectPermission } from './VerifyUserHasCorrectPermission'

/**
 * @deprecated Use getEvent(eventId:string) and perform manual checks on user security
 * 
 * @param event_id the id of the event to get
 * @param user_id the id of the user requesting events
 * 
 * @throws 403 - Invalid Permission Level
 * @throws 450 - Non-Existant Event
 * @throws 500 - Server Error
 * 
 * @returns an event
 */
export async function getEventById(event_id: string, user: User): Promise<Event> {

    const db = admin.firestore()
    
    const event = await db.collection(HouseCompetition.EVENTS_KEY).doc(event_id).get()
    if (!event.exists) {
        return Promise.reject(APIResponse.NonExistantEvent())
    }
    if (event.data()!.House !== user.house && event.data()!.House !== "All Houses") {
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
    }
    const event_obj = Event.fromData(event_id, event.data()!)
    return Promise.resolve(event_obj)

}

/**
 * Retrieves the event with the provided id
 * @param eventId Id of the event to retrieve
 * @throws 450 - Non-Existant Event
 */
export async function getEvent(eventId:string): Promise<Event> {
    const db = admin.firestore()
    
    const eventDoc = await db.collection(HouseCompetition.EVENTS_KEY).doc(eventId).get()
    if (!eventDoc.exists) {
        return Promise.reject(APIResponse.NonExistantEvent())
    }
    else{
        return Event.fromData(eventId, eventDoc.data()!)
    }
}