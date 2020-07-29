import * as admin from 'firebase-admin'
import { HouseCompetition } from "../models/HouseCompetition"
import { getHouseByNameWithTransaction } from "./GetHouses"

export async function grantHouseAward(house_id:string, pointsPerResident:number, description:string){
    const db = admin.firestore()
    await db.runTransaction(async (transaction) => {
        const house = await getHouseByNameWithTransaction(db, transaction, house_id)
        
        house.grantHouseAward(pointsPerResident, description)
        transaction.update(db.collection(HouseCompetition.HOUSE_KEY).doc(house.id), house.toPointUpdateJson())
    })
}