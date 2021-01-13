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

    // const db = admin.firestore()
    // if (user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF) {
    //     // Professional staff should see all events
    //     const events = Event.fromQuerySnapshot(await db.collection(HouseCompetition.EVENTS_KEY).get())
    //     events.sort((a:Event, b:Event) => {
    //         return (b.date < a.date)? -1: 1
    //     })
    //     return Promise.resolve(events)
    // } else {
    //     const eventsSnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('House', 'in', [user.house, "All Houses"]).get()
    //     const events = Event.fromQuerySnapshot(eventsSnapshot)
    //     events.sort((a:Event, b:Event) => {
    //         return (b.date < a.date)? -1: 1
    //     })
    //     return Promise.resolve(events)
       
    // }

    return []
}

/**
 * 
 * @param user User to get events for
 */
export async function getEventsFeed(user: User): Promise<Event[]> {

    const db = admin.firestore()
    let eventQuerySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    let now = new Date()
    console.log('NOW: '+JSON.stringify(user))

    switch(user.permissionLevel){
        case UserPermissionLevel.PROFESSIONAL_STAFF:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('endDate', '>=', now).orderBy('endDate','asc').get()
            break
        case UserPermissionLevel.FACULTY:
            const house = await getHouseByName(user.house)
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('floorIds','array-contains-any', house.floorIds).where('endDate', '>=', now).orderBy('endDate','asc').get()
            break
        case UserPermissionLevel.RHP:
        case UserPermissionLevel.RESIDENT:
        case UserPermissionLevel.PRIVILEGED_RESIDENT:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('floorIds','array-contains', user.floorId).where('endDate', '>=', now).orderBy('endDate','asc').get()
            console.log(JSON.stringify(eventQuerySnapshot.docs))
            break
        case UserPermissionLevel.EXTERNAL_ADVISOR:
            eventQuerySnapshot = await db.collection(HouseCompetition.EVENTS_KEY).where('isPublicEvent', '==',true).where('endDate', '>=', now).orderBy('endDate','asc').get()
            break
    }
    return Event.fromQuerySnapshot(eventQuerySnapshot)
}
