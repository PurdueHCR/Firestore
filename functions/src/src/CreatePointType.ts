import * as admin from 'firebase-admin'
import { HouseCompetition } from '../models/HouseCompetition'
import { PointType } from '../models/PointType'
import { getSystemPreferences } from './GetSystemPreferences'


/**
 * Create a point type with these fields. The id will be one above the previous point type id
 * @param description 
 * @param enabled 
 * @param name 
 * @param residentsCanSubmit 
 * @param level 
 * @param value 
 */
export async function createPointType(description:string, enabled:boolean, name:string, residentsCanSubmit:boolean, level:number, value:number): Promise<PointType> {

    const db = admin.firestore()
    const pointTypes = PointType.fromQuerySnapshot(await db.collection(HouseCompetition.POINT_TYPES_KEY).get())
    pointTypes.sort((a,b) => (parseInt(a.id) - parseInt(b.id)))
    let id:string
    if(pointTypes.length === 0){
        id = "1"
    }
    else{
        id = (parseInt(pointTypes[pointTypes.length - 1].id) + 1).toString()
    }
    const pointType = new PointType(id,description,enabled, name, level, residentsCanSubmit, value)
    await db.collection(HouseCompetition.POINT_TYPES_KEY).doc(id).set(pointType.firestoreJson())
    pointType.id = id
    const systemPreferences = await getSystemPreferences()
    for(const house of systemPreferences.houseIds){
        const housePointTypeSubmissionsRef = db.collection(HouseCompetition.HOUSE_KEY).doc(house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_POINT_TYPES_DOC)
        const pointTypeUpdate = {}
        pointTypeUpdate[pointType.id] = {
            name:pointType.name,
            submitted: 0,
            approved: 0
        }
        await housePointTypeSubmissionsRef.update(pointTypeUpdate)
    }

    return pointType
}
