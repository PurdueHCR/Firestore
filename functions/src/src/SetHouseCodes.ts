import { APIResponse } from "../models/APIResponse";
import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";
import { HouseCode } from "../models/HouseCode";

/**
 * Create the following house codes in the database
 * @param codes HouseCodes to add
 * @throws 500
 */
export async function setHouseCodes(codes:HouseCode[]){
    for (const code of codes){
        await setHouseCode(code)
    }
}

/**
 * Set a new house code. Do not use this function for updating a point type
 * @param code House Code to set in database
 * @throws 500
 */
export async function setHouseCode(code:HouseCode){
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.HOUSE_CODES_KEY).doc(code.id.toString()).set(code.firestoreJson())
    }
    catch (err) {
        console.error("Error setting pointType. " + err)
		throw APIResponse.ServerError()
    }
}