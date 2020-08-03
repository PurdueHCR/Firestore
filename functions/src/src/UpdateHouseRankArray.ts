import { House } from '../models/House'
import * as admin from "firebase-admin"
import { RankArray } from '../models/RankArray'
import { HouseCompetition } from '../models/HouseCompetition'

export async function updateHouseRankArray(house:House, rankArray:RankArray){
    const db = admin.firestore()
    await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).update(rankArray.toFirestoreJson())
}