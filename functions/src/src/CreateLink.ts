import * as admin from 'firebase-admin'
import { getPointTypeById } from "./GetPointTypeById"
import { makeDynamicLinkForLink } from "./CreateDynamicLink"
import {User} from "../models/User"
import { APIResponse } from '../models/APIResponse';
import { Link } from '../models/Link';
import { HouseCompetition } from '../models/HouseCompetition';

/**
 * 
 * @param user_id 
 * @param point_type_id 
 * @param single_use 
 * @param is_enabled
 * @param description 
 * @throws 417 - Unkown Point Type
 * @throws 418 - Point Type Disabled
 * @throws 430 - InsufficientPointTypePermissionForLink
 * @throws 500 - Server Error
 */
export async function createLink(user:User, point_type_id: number, is_single_use: boolean, is_enabled: boolean, description: string) : Promise<Link>{
    const blank_id = "";
    const is_archived = false;

    const db = admin.firestore()
    const pointType = await getPointTypeById(point_type_id)
    if(pointType.canUserGenerateLinks(user.permissionLevel)){
        let link = new Link(blank_id,is_archived,user.id, 0, description, is_enabled, point_type_id, pointType.name, pointType.description, pointType.value, is_single_use);
        const linkDoc = await db.collection(HouseCompetition.LINKS_KEY).add(link.toFirebaseJson())
        link = Link.fromSnapshotDocument(await linkDoc.get());

        const dynamicLink = await makeDynamicLinkForLink(link)
        link.dynamicLink = dynamicLink.toString()
        await linkDoc.update(link.updateDynamicLinkJson())
        
        return Promise.resolve(link)
    }
    else if(!pointType.enabled){
        return Promise.reject(APIResponse.PointTypeDisabled())
    }
    else{
        return Promise.reject(APIResponse.InsufficientPointTypePermissionForLink())
    }
}
