import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { Event } from '../models/Event'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'
import { verifyUserHasCorrectPermission } from './VerifyUserHasCorrectPermission'

/**
 * This function returns the event with the given id if it exists
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
    if (event.data()!.house !== user.house && event.data()!.house !== "All Houses") {
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
    }
    const event_obj = Event.fromData(event_id, event.data()!)
    console.log(event_obj)
    return Promise.resolve(event_obj)

}