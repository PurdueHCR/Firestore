import * as admin from 'firebase-admin'
import { getUser } from './GetUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { APIResponse } from '../models/APIResponse'
import { HouseCompetition } from '../models/HouseCompetition'
import { Event } from '../models/Event'

export async function addEvent(event: Event): Promise<Boolean> {
    
    let user = await getUser(event.creator_id)
    if (user.permissionLevel === UserPermissionLevel.RESIDENT) {
        return Promise.reject(APIResponse.InvalidPermissionLevel())
    }
    
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