import * as admin from 'firebase-admin'
import { User } from '../models/User'
import { Event } from '../models/Event'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { HouseCompetition } from '../models/HouseCompetition'
import { getHouseByName } from './GetHouses'

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
    const events = Event.fromQuerySnapshot(await db.collection(HouseCompetition.EVENTS_KEY).where('creatorId', "==",user.id).orderBy('startDate','asc').get())
    return events
}

/**
 * 
 * @param user User to get events for
 */
export async function getEventsFeed(user: User): Promise<Event[]> {

    const db = admin.firestore()
    let eventQuerySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    const now = new Date()

    switch(user.permissionLevel){
        case UserPermissionLevel.PROFESSIONAL_STAFF:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('endDate', '>=', now).get()
            break
        case UserPermissionLevel.FACULTY:
            const house = await getHouseByName(user.house)
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('floorIds','array-contains-any', house.floorIds).where('endDate', '>=', now).get()
            break
        case UserPermissionLevel.RHP:
        case UserPermissionLevel.RESIDENT:
        case UserPermissionLevel.PRIVILEGED_RESIDENT:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('floorIds','array-contains', user.floorId).where('endDate', '>=', now).get()
            break
        case UserPermissionLevel.EXTERNAL_ADVISOR:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('isPublicEvent', '==',true).where('endDate', '>=', now).get()
            break
    }
    const events = Event.fromQuerySnapshot(eventQuerySnapshot)
    events.sort((a:Event, b:Event) => a.startDate.getTime() - b.startDate.getTime())
    return events
}
