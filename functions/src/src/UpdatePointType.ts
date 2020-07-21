import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { PointType } from '../models/PointType'


export async function updatePointType(pointType: PointType) {

    const db = admin.firestore()
    await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(pointType.id).update(pointType.firestoreJson())

}
