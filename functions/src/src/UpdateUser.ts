import * as admin from "firebase-admin"
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'

export async function updateUser(user:User){
    const db = admin.firestore()
    await db.collection(HouseCompetition.USERS_KEY).doc(user.id).update(user.toFirestoreJson())

}