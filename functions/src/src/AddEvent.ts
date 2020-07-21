import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'
import { PointType } from '../models/PointType'

/**
 * Add an Event
 * 
 * @param name event name
 * @param details event details
 * @param date event date
 * @param location event location string
 * @param points number of points for attending the event
 * @param point_type PointType associated with the event
 * @param house house name for attending event
 * @param creator_id id of the user creating the event
 * 
 * @throws 500 - Server Error
 * 
 * @returns a promise indicating success
 */

export async function addEvent(name: string, details: string, date: Date, location: string,
                                points: number, point_type: PointType, house: string, creator_id: string): Promise<void> {
    let event = new Event(name, details, date, location, points, Number(point_type.id), point_type.name.toString(),
                        point_type.description.toString(), house, creator_id, "")
    const db = admin.firestore()
    let data = event.toFirestoreJson()
    await db.collection(HouseCompetition.EVENTS_KEY).add(data)
    Promise.resolve(true)
}