import { PointType } from "../models/PointType";
import { APIResponse } from "../models/APIResponse";
import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";

/**
 * Create the following points types in the database
 * @param types Point types to add
 * @throws 500
 */
export async function setPointTypes(types:PointType[]){
    for (const type of types){
        await setPointType(type)
    }
}

/**
 * Set a new point type. Do not use this function for updating a point type
 * @param type Point type to set in database
 * @throws 500
 */
export async function setPointType(type:PointType){
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(type.id.toString()).set(type.firestoreJson())
    }
    catch (err) {
        console.error("Error setting pointType. " + err)
		throw APIResponse.ServerError()
    }
}