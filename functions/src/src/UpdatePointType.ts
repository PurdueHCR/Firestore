import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { PointType } from '../models/PointType'
import { getSystemPreferences } from './GetSystemPreferences'


export async function updatePointType(pointType: PointType) {
    console.log("Update this point type")
    const db = admin.firestore()
    await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(pointType.id).update(pointType.firestoreJson())

    const systemPreferences = await getSystemPreferences()
    for(const house of systemPreferences.houseIds){
        console.log("Doing house: "+house+" and putting "+pointType.name+" into "+pointType.id)
        await db.runTransaction(async (transaction) => {
            console.log("Enter transaction")
            const housePointTypeSubmissionsRef = db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC)
            const hptsDoc = await transaction.get(housePointTypeSubmissionsRef)
            const pointTypeUpdate = {}
            pointTypeUpdate[pointType.id] = {
                name:pointType.name,
                submitted: hptsDoc.data()![pointType.id].submitted,
                approved: hptsDoc.data()![pointType.id].approved
            }
            transaction.update(housePointTypeSubmissionsRef, pointTypeUpdate)
        })
        
    }

}
