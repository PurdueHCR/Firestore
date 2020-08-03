import { APIResponse } from "../models/APIResponse";
import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";
import { House } from "../models/House";
import { PointType } from "../models/PointType";
import { getPointTypes } from "./GetPointTypes";

/**
 * Create the following houses in the database
 * @param houses houses to add
 * @throws 500
 */
export async function setHouses(houses:House[]){
    const pointTypes = await getPointTypes()
    for (const house of houses){
        await setHouse(house, pointTypes)
    }
}

/**
 * Set a new house. Do not use this function for updating a point type
 * @param house hosue to set in database
 * @throws 500
 */
export async function setHouse(house:House, pointTypes:PointType[]){
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id.toString()).set(house.firestoreJson())
        await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).set({})
        const pointTypeData= {}
        for(const pt of pointTypes){
            pointTypeData[pt.id] = {name:pt.name, submitted:0,approved:0}
        }
        await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC).set(pointTypeData)
    }
    catch (err) {
        console.error("Error setting House. " + err)
		throw APIResponse.ServerError()
    }
}