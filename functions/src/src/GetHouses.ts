import * as admin from 'firebase-admin'
import { HouseCompetition } from "../models/HouseCompetition"
import { APIResponse } from "../models/APIResponse"
import { House } from '../models/House'

/**
 * Get all houses in order of ppr
 * @throws 500 - ServerError
 */
export async function getAllHouses() : Promise<House[]> {
	try {
        const db = admin.firestore()
		const houseQuerySnapshot = await db.collection(HouseCompetition.HOUSE_KEY).get()
		const houses = House.fromQuerySnapshot(houseQuerySnapshot);
		houses.sort((a:House, b:House) => {
			return b.pointsPerResident-a.pointsPerResident
		})
		return Promise.resolve(houses)
	}
	catch (err) {
		console.log("GET All Houses Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}

/**
 * Get a House from its Name
 * 
 * @param name The name of the house to retrieve
 * @throws 425 - UnknownHouse
 * @throws 500 - ServerError
 */
export async function getHouseByName(name: string) : Promise<House> {
	const db = admin.firestore()
	const houseDocumentSnapshot = await db.collection(HouseCompetition.HOUSE_KEY).doc(name).get()
	if(!houseDocumentSnapshot.exists){
		throw APIResponse.UnknownHouse()
	}
	else{
		return House.fromDocumentSnapshot(houseDocumentSnapshot)
	}
}

/**
 * Get a House from its Name
 * 
 * @param name The name of the house to retrieve
 * @throws 425 - UnknownHouse
 * @throws 500 - ServerError
 */
export async function getHouseByNameWithTransaction(db: FirebaseFirestore.Firestore ,transaction: FirebaseFirestore.Transaction,name: string) : Promise<House> {
	const houseDocumentSnapshot = await transaction.get(db.collection(HouseCompetition.HOUSE_KEY).doc(name))
	if(!houseDocumentSnapshot.exists){
		throw APIResponse.UnknownHouse()
	}
	else{
		return House.fromDocumentSnapshot(houseDocumentSnapshot)
	}
}