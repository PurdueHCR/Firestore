import * as admin from 'firebase-admin'
import { House } from '../models/House'
import { HouseCompetition } from '../models/HouseCompetition'
export async function updateHouse(house:House){
    const db = admin.firestore()
    await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).update(house.updateHouseJson())
}

export async function updateCompleteHouse(house:House){
    const db = admin.firestore()
    await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).update(house.firestoreJson())
}