import * as admin from 'firebase-admin'
import { House } from "../models/House"
import { RankArray } from "../models/RankArray"
import { HouseCompetition } from "../models/HouseCompetition"

/**
 * Retrieves the rank document for a given house that has all the semseter and total points for users
 * @param house House to Get Rank Document for
 */
export async function getRankArray(house:House): Promise<RankArray>{
    const db = admin.firestore()
    const rankArrayDoc = await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).get()
    const rankArray = RankArray.fromDocumentSnapshot(rankArrayDoc)
    return rankArray
}