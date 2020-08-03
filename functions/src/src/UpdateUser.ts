import * as admin from "firebase-admin"
import { User } from '../models/User'
import { HouseCompetition } from '../models/HouseCompetition'

export async function updateUser(user:User){
    const db = admin.firestore()
    await db.collection(HouseCompetition.USERS_KEY).doc(user.id).update(user.toFirestoreJson())
    if(user.isParticipantInCompetition()){
        const userHouseRank = user.getHouseRankModel()
        console.log("UPDATING: "+JSON.stringify(userHouseRank.toFirestoreJson()))
        await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).update(userHouseRank.toFirestoreJson())
    }

}

export async function removeUserFromHouse(user:User){
    const db = admin.firestore()
    console.log("IN HERE")
    if(user.isParticipantInCompetition()){
        const update = {}
        update[user.id] = admin.firestore.FieldValue.delete()
        await db.collection(HouseCompetition.HOUSE_KEY).doc(user.house).collection(HouseCompetition.HOUSE_DETAILS_KEY).doc(HouseCompetition.HOUSE_DETAILS_RANK_DOC).update(update)
    }
}