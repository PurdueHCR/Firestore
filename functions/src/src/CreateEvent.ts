 import * as admin from 'firebase-admin'
// import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'
import { APIResponse } from '../models/APIResponse'
import { PointType } from '../models/PointType'
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'

/**
 * 
 * @param user 
 * @param name 
 * @param details 
 * @param startDate 
 * @param endDate 
 * @param location 
 * @param pointType 
 * @param floorIds 
 * @param host 
 */
export async function createEvent(user:User, name: string, details: string, startDate: Date, endDate: Date, location: string, pointType: PointType, floorIds: string[], host: string) : Promise<Event>{
    if (!pointType.canUserGenerateLinks(user.permissionLevel)) {
        throw APIResponse.InsufficientPointTypePermissionForLink()
    }
    if (!pointType.enabled) {
        throw APIResponse.PointTypeDisabled()
    }
    const event = new Event(name, details, startDate, endDate, location, pointType.value, pointType.id, pointType.name, pointType.description, floorIds, user.id, '', host)
    const db = admin.firestore()
    const result = await db.collection(HouseCompetition.EVENTS_KEY).add(event.toFirestoreJson())
    event.id = result.id
    return event
}