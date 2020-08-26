import * as admin from 'firebase-admin'
import { House } from "../models/House"
import { HouseCompetition } from "../models/HouseCompetition"
import { HousePointTypeHistory } from '../models/HousePointTypeHistory'

export async function getHousePointTypeHistory(house:House): Promise<HousePointTypeHistory>{
    const db = admin.firestore()
    const pointTypesDoc = await db.collection(HouseCompetition.HOUSE_KEY).doc(house.id).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC).get()
    return HousePointTypeHistory.fromDocumentSnapshot(pointTypesDoc)
}