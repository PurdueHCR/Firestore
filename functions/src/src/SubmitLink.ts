import { User } from "../models/User"
import { Link } from "../models/Link"
import {submitPoint} from "./SubmitPoints"
import { UnsubmittedPointLog } from "../models/UnsubmittedPointLog"
import { APIResponse } from "../models/APIResponse"

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

    if(link.enabled){
        const log = new UnsubmittedPointLog(new Date(Date.now()), link.description, link.pointId)
        if(link.singleUse){
            return submitPoint(user,log, user.id+link.id, true)
        }
        else{
            return submitPoint(user,log,null, true)
        }
    }
    else{
        return Promise.reject(APIResponse.LinkIsNotEnabled())
    }
}