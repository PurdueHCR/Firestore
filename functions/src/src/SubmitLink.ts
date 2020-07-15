import * as admin from 'firebase-admin'
import { User } from "../models/User"
import { Link } from "../models/Link"
import {submitPoint} from "./SubmitPoints"
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { APIResponse } from "../models/APIResponse"
import { HouseCompetition } from '../models/HouseCompetition'

/**
 * Submit a link for points
 * @param user user for whom to submit the link
 * @param link Link to submit
 * 
 * @throws 403 - This User does not have the correct permission levels.
 * @throws 409 - This Link Has Already Been Submitted
 * @throws 412 - House Competition Is Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 419 - Users Can Not Self Submit This Point Type
 * @throws 500 - Server Error
 */
export async function submitLink(user:User, link:Link): Promise<Boolean>{

    const db = admin.firestore()

    if(link.enabled){
        const log = new UnsubmittedPointLog(new Date(Date.now()), link.description, link.pointId)
        let approved: Boolean
        if(link.singleUse){
            approved = await submitPoint(user,log, user.id+link.id, true)
        }
        else{
            approved = await submitPoint(user,log,null, true)
        }
        await db.runTransaction(async (transaction) => {
			//Get the current house
			const linkSnapshot = await transaction.get(db.collection(HouseCompetition.LINKS_KEY).doc(link.id))
			const currentLink = Link.fromSnapshotDocument(linkSnapshot)
            
            currentLink.claimedCount += 1
            transaction.update(db.collection(HouseCompetition.LINKS_KEY).doc(link.id), currentLink.updateClaimedCountJson())
        })
        
        return approved
    }
    else{
        return Promise.reject(APIResponse.LinkIsNotEnabled())
    }
}