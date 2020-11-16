 import * as admin from 'firebase-admin'
// import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'
import { APIResponse } from '../models/APIResponse'
import { PointType } from '../models/PointType'
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'
import { getHousesFromFloorIds } from './GetHouses'

/**
 * Creates an event with the foloowing parameters
 * @param user User who created this event
 * @param name Name of the evebt
 * @param details Details of the event
 * @param startDate Start date of the event
 * @param endDate End date of the event
 * @param location Location of the event
 * @param pointType PointType for the event
 * @param floorIds List of floors that are attending the event
 * @param host Public host name for the event
 * @param isPublicEvent Boolean is the event public
 * @param isAllFloors Are all floors invited?
 */
export async function createEvent(user:User, name: string, details: string, startDate: Date, endDate: Date, location: string, pointType: PointType, floorIds: string[], host: string, isPublicEvent:boolean, isAllFloors:boolean) : Promise<Event>{
    const db = admin.firestore()
    if (!pointType.canUserGenerateLinks(user.permissionLevel)) {
        throw APIResponse.InsufficientPointTypePermissionForLink()
    }
    if (!pointType.enabled) {
        throw APIResponse.PointTypeDisabled()
    }

    let colors:string[] = []
    if(isAllFloors){
        const houses = await getHousesFromFloorIds(db, floorIds)
        for(const house of houses){
            colors.push(house.color)
        }
    }
    else{
        colors.push('#CFB991')
    }
    

    const event = new Event(name, details, startDate, endDate, location, pointType.value, pointType.id, pointType.name, pointType.description, floorIds, user.id, '', host, colors, isPublicEvent)
    const result = await db.collection(HouseCompetition.EVENTS_KEY).add(event.toFirestoreJson())
    event.id = result.id
    return event
}