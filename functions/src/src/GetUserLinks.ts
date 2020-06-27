import * as admin from 'firebase-admin'
import { APIResponse } from "../models/APIResponse"
import { HouseCompetition } from "../models/HouseCompetition"
import { Link } from '../models/Link'


/**
 * Get all the links created by a user
 * @param userID - Id of user whose lniks should be retrieved
 * @param limit - Optional number of point logs to retrieve
 * @throws 500 - ServerError
 */
export async function getUserLinks(userID: string, limit: number = -1) : Promise<Link[]> {
    try {
        const db = admin.firestore()
        const reference = db.collection(HouseCompetition.LINKS_KEY).where(Link.CREATOR_ID, '==', userID)
        const linkSnapshot = await reference.get()
        let links = Link.fromQuerySnapshot(linkSnapshot)
        if(limit > 0){
            links = links.slice(0,limit)
        }
        return Promise.resolve(links)
    }
    catch (err) {
        console.error("GET PointLogs error: " + err)
        return Promise.reject(APIResponse.ServerError())
    }
}