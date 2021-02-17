 import * as admin from 'firebase-admin'
// import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'
import { APIResponse } from '../models/APIResponse'
import { PointType } from '../models/PointType'
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'
import { getHousesFromFloorIds } from './GetHouses'
import { getSystemPreferences } from './GetSystemPreferences'

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
 * @param virtualLink Link to a virtual meeting
 */
export async function createEvent(user:User, name: string, details: string, startDate: Date, endDate: Date, location: string, pointType: PointType, floorIds: string[], host: string, isPublicEvent:boolean, isAllFloors:boolean, virtualLink:string) : Promise<Event>{
    const db = admin.firestore()
    if (!pointType.canUserGenerateLinks(user.permissionLevel)) {
        throw APIResponse.InsufficientPointTypePermissionForLink()
    }
    if (!pointType.enabled) {
        throw APIResponse.PointTypeDisabled()
    }
    const event = new Event(name, details, startDate, endDate, location, pointType.value, pointType.id, pointType.name, pointType.description, [], user.id, '', host, [], isPublicEvent, 0, virtualLink)

    if(isPublicEvent){
        event.isPublicEvent = true
        await setAllFloors(event)
    }
    else if(!isAllFloors){
        await setFloors(event, floorIds)
    }
    else{
        await setAllFloors(event)
    }
    

    const result = await db.collection(HouseCompetition.EVENTS_KEY).add(event.toFirestoreJson())
    event.id = result.id
    return event
}


export async function setAllFloors(event:Event){
    event.floorColors = ['#CFB991']
    event.floorIds = (await getSystemPreferences()).floorIds
}

export async function setFloors(event:Event, floorIds: string[]){
    const db = admin.firestore()
    const houses = await getHousesFromFloorIds(db, floorIds)
    event.floorColors = []
    for(const house of houses){
        event.floorColors.push(house.color)
    }
    event.isPublicEvent = false
    event.floorIds = floorIds
}