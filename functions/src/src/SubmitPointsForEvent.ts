import * as admin from 'firebase-admin'
import { User } from "../models/User"
import { Event } from "../models/Event"
import {submitPoint} from "./SubmitPoints"
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { APIResponse } from "../models/APIResponse"
import { HouseCompetition } from '../models/HouseCompetition'
import { UserPermissionLevel } from '../models/UserPermissionLevel'

/**
 * If valid, submits a point log for this event and increments the claimed count
 * @param user User that is submitting the event
 * @param event Event to submit points for
 * @throws 403 - This User does not have the correct permission levels.
 * @throws 409 - Points Already Claimed
 * @throws 412 - House Competition Is Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 419 - Users Can Not Self Submit This Point Type
 * @throws 429 - Event Submission Not Open
 * @throws 432 - Can Not Access Event
 * @throws 500 - Server Error
 */
export async function submitPointsForEvent(user:User, event:Event): Promise<Boolean>{

    const db = admin.firestore()
    //Check if user hosue is in the list
    if(event.floorIds.includes(user.floorId)){

        //Check if event is currently accepting submissions
        const now = new Date()
        console.log('startDate: '+event.startDate)
        console.log('DATE: '+now.toISOString())
        console.log('endDate: '+event.endDate)
        if(event.startDate <= now && now <= event.endDate){

            //Create point log
            const log = new UnsubmittedPointLog(now, `Attended ${event.name}`, Number.parseInt(event.pointTypeId))

            //Submit point
            const approved = await submitPoint(user, log, user.permissionLevel === UserPermissionLevel.RHP, user.id+event.id, true)

            //Update the claimed count on the event with a transaction
            await db.runTransaction(async (transaction) => {
                
                const eventSnapshot = await transaction.get(db.collection(HouseCompetition.EVENTS_KEY).doc(event.id))
                const currentEvent = Event.fromDocumentSnapshot(eventSnapshot)
                
                currentEvent.claimedCount += 1
                transaction.update(db.collection(HouseCompetition.EVENTS_KEY).doc(event.id), currentEvent.getUpdateClaimedCountJson())
            })
            
            return approved
        }
        else{
            throw APIResponse.EventSubimssionsNotOpen()
        }
    }
    else{
        throw APIResponse.CanNotAccessEvent()
    }
}