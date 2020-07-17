import * as admin from 'firebase-admin'
import { PointLog } from '../models/PointLog';
import { HouseCompetition } from '../models/HouseCompetition';

/**
 * Retrieve a list of point logs for the house that occurred before the provided date
 * @param house house to get the history for
 * @param date Most recent date to use as an upper bound
 * @param startAt Date to start the query at for pagination
 */
export async function getRecentHistory(house:string, date:Date, startAt?:Date): Promise<PointLog[]> {
    console.log("House: "+house)
    console.log("Date: "+date.toString())
    const db = admin.firestore()
    let ref = db.collection(HouseCompetition.HOUSE_KEY)
                .doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY).where("DateSubmitted", "<=", date)
                .orderBy("DateSubmitted","desc").limit(25)
    if(startAt !== undefined){
        ref = ref.startAfter(startAt)
    }
    const logQuerySnapshot = await ref.get()
    let logs = PointLog.fromQuerySnapshot(logQuerySnapshot)
    return logs
}

/**
 * Retrieve a list of point logs for users with the provided last name
 * @param house house to get the history for
 * @param name last name of the user to search for submissions of
 * @param startAt Date to start the query at for pagination
 */
export async function getHistoryFilterUser(house:string, name:string, startAt?:Date): Promise<PointLog[]> {
    const db = admin.firestore()
    let ref = db.collection(HouseCompetition.HOUSE_KEY)
                        .doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY)
                        .where("ResidentLastName","==",name).orderBy("DateSubmitted","desc").limit(25)

    if(startAt !== undefined){
        ref = ref.startAfter(startAt)
    }
    const logQuerySnapshot = await ref.get()
    let logs = PointLog.fromQuerySnapshot(logQuerySnapshot)
    return logs
}

/**
 * Retrieve a list of point logs for users with the provided last name
 * @param house house to get the history for
 * @param point_type_id number of the id for the point type
 * @param startAt Date to start the query at for pagination
 */
export async function getHistoryFilterPointType(house:string, point_type_id:number, startAt?:Date): Promise<PointLog[]> {
    const db = admin.firestore()
    let ref = db.collection(HouseCompetition.HOUSE_KEY)
    .doc(house).collection(HouseCompetition.HOUSE_COLLECTION_POINTS_KEY)
    .where("PointTypeID","==",point_type_id).orderBy("DateSubmitted","desc").limit(25)
                        
    if(startAt !== undefined){
        ref = ref.startAfter(startAt)
    }
    const logQuerySnapshot = await ref.get()
    let logs = PointLog.fromQuerySnapshot(logQuerySnapshot)
    return logs
}