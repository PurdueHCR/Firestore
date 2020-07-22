import * as admin from 'firebase-admin'
import { HouseCode } from "../models/HouseCode"
import { HouseCompetition } from '../models/HouseCompetition'
import { makeDynamicLinkForHouseCode } from './CreateDynamicLink'


export async function refreshHouseCode(code:HouseCode){
    const db = admin.firestore()
    code.code = randomString(6)
    code.dynamicLink = await makeDynamicLinkForHouseCode(code)
    await db.collection(HouseCompetition.HOUSE_CODES_KEY).doc(code.id).update(code.getUpdateCodeFirestoreJson())
}

/**
 * Refresh the given house codes with new codes and deep links
 * @param codes House Codes to refresh with new codes
 */
export async function refreshHouseCodes(codes:HouseCode[]){
    for(let code of codes){
        await refreshHouseCode(code)
    }
}



/**
 * Generate a random string
 * 
 * @param length length of the string
 */
function randomString(length) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
}