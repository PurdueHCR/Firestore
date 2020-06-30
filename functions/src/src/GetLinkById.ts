import * as admin from "firebase-admin"
import { Link } from '../models/Link'
import { HouseCompetition } from '../models/HouseCompetition'
import { APIResponse } from '../models/APIResponse'

/**
 * Retrieves a link with the provided Id
 * @param linkId Firestore id of the link to retrieve
 * @throws 408 - Link Doesn't Exist
 * @throws 500 - Server Error
 */
export async function getLinkById(linkId:string): Promise<Link>{
    const db = admin.firestore()
    try{
        const linkDoc = await db.collection(HouseCompetition.LINKS_KEY).doc(linkId).get()
        if(linkDoc.exists){
            return Promise.resolve(Link.fromSnapshotDocument(linkDoc));
        }
        else{
            return Promise.reject(APIResponse.LinkDoesntExist())
        }
    }
    catch (err){
		console.error("GET USER ERROR: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
    
}