import { APIResponse } from "../models/APIResponse";
import * as admin from "firebase-admin";
import { HouseCompetition } from "../models/HouseCompetition";
import { House } from "../models/House";

/**
 * Create the following houses in the database
 * @param houses houses to add
 * @throws 500
 */
export async function setHouses(houses:House[]){
    for (const house of houses){
        await setHouse(house)
    }
}

/**
 * Set a new house. Do not use this function for updating a point type
 * @param house hosue to set in database
 * @throws 500
 */
export async function setHouse(house:House){
    const db = admin.firestore()
    try{
        await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id.toString()).set(house.firestoreJson())
    }
    catch (err) {
        console.error("Error setting pointType. " + err)
		throw APIResponse.ServerError()
    }
}