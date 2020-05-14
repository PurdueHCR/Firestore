import * as admin from 'firebase-admin'
import { HouseCode } from "../models/Housecode";
import { HouseCompetition } from '../models/HouseCompetition';
import { APIResponse } from '../models/APIResponse';

/**
 * Retrieve the list of house codes
 * 
 * @returns HouseCode[]
 * @throws 	500 - ServerError
 */
export async function getHouseCodes(): Promise<HouseCode[]> {
    const db = admin.firestore()
    return db.collection(HouseCompetition.HOUSE_CODES_KEY).get().then(houseCodeDocs => {
        const codes: HouseCode[] = []
        for( const codeDoc of houseCodeDocs.docs){
            const code = HouseCode.fromDocumentSnapshot(codeDoc)
            codes.push(code)
        }
        return Promise.resolve(codes)
    })
    .catch(err => {
        console.log("Firestore failed to get house codes with error:  "+err)
        const error = APIResponse.ServerError()
        return Promise.reject(error)
    })
}