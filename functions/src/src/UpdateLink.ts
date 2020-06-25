import * as admin from 'firebase-admin'
import { APIResponse } from '../models/APIResponse'

/**
 * Update the link with the provided ID and the provided fields
 * @param id string Firestore id of link to update
 * @param options string parameters to update on the link
 * @throws 500 - Server Error
 */
export async function updateLink(id:string, options:LinkUpdateOptions) : Promise<void>{
    const db = admin.firestore()
    try{
        await db.collection("Links").doc(id).update(options)
        return Promise.resolve()
    }
    catch(suberror){
        console.log("FAILED WITH DB FROM link create ERROR: "+ suberror)
        const apiResponse = APIResponse.ServerError()
        return Promise.reject(apiResponse)
    }
}

export declare type LinkUpdateOptions = {
    Archived?: boolean,
    Description?: string,
    Enabled?: boolean,
    SingleUse?: boolean
}