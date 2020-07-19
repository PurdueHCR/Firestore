import * as admin from 'firebase-admin'
import { APIResponse } from '../models/APIResponse'
import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'

/**
 * Add an Event
 * 
 * @param name event name
 * @param details event details
 * @param date event date
 * @param location event location string
 * @param points number of points for attending the event
 * @param point_type_id id of the PointType associated with the event
 * @param point_type_name name of the PointType associated with the event
 * @param point_type_description description of the PointType associated with the event
 * @param house house name for attending event
 * @param creator_id id of the user creating the event
 * 
 * @throws 500 - Server Error
 * 
 * @returns a promise indicating success
 */

export async function addEvent(name: string, details: string, date: Date, location: string,
                                points: number, point_type_id: number, point_type_name: string,
                                point_type_description: string, house: string, creator_id: string): Promise<Boolean> {
    let event = new Event(name, details, date, location, points, point_type_id, point_type_name,
                        point_type_description, house, creator_id, "")
    const db = admin.firestore()
    try {
        let data = event.toFirestoreJson()
        await db.collection(HouseCompetition.EVENTS_KEY).add(data)
        return Promise.resolve(true)
    } catch (error) {
        if (error instanceof APIResponse) {
            return Promise.reject(error)
        } else {
            console.error(error)
            const apiError = APIResponse.ServerError()
            return Promise.reject(apiError)
        }
    }
}