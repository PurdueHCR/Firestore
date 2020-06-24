import * as admin from 'firebase-admin'
import { getPointTypeById } from "./GetPointTypeById"
import {User} from "../models/User"
import { APIResponse } from '../models/APIResponse';
import { Link } from '../models/Link';
import { HouseCompetition } from '../models/HouseCompetition';

/**
 * 
 * @param user_id 
 * @param point_type_id 
 * @param single_use 
 * @param description 
 * @throws 417 - Unkown Point Type
 * @throws 500 - Server Error
 */
export async function createLink(user:User, point_type_id: number, is_single_use: boolean, description: string) : Promise<Link>{
    try{
        const blank_id = "";
        const is_enabled = false;
        const is_archived = false;
    
        const db = admin.firestore()
        const pointType = await getPointTypeById(point_type_id)
        if(pointType.canUserGenerateLinks(user.permissionLevel)){
            let link = new Link(blank_id,is_archived,user.id, description, is_enabled, point_type_id, is_single_use);
            const linkDoc = await db.collection(HouseCompetition.LINKS_KEY).add(link.toFirebaseJson())
            link = Link.fromSnapshotDocument(await linkDoc.get());
            return Promise.resolve(link)
        }
        else{
            return Promise.reject(APIResponse.InvalidPermissionLevel())
        }
    }
    catch(err){
        console.log("GET Point type Error: " + err)
		return Promise.reject(APIResponse.ServerError())
    }
        
}
