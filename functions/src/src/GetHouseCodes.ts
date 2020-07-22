import * as admin from 'firebase-admin'
import { HouseCode } from "../models/HouseCode";
import { HouseCompetition } from '../models/HouseCompetition';
import { APIResponse } from '../models/APIResponse';
import { User } from '../models/User';
import { UserPermissionLevel } from '../models/UserPermissionLevel';

/**
 * Retrieve the list of house codes
 * 
 * @returns HouseCode[]
 * @throws 	500 - ServerError
 */
export async function getHouseCodes(): Promise<HouseCode[]> {
    const db = admin.firestore()
    const querySnapshot = await db.collection(HouseCompetition.HOUSE_CODES_KEY).get()
    return HouseCode.fromQuerySnapshot(querySnapshot)
}

/**
 * Get a list of house codes that a user is allowed to view. Only works for Professional staff, rhps, and house advistors
 * @param user User to get viewable house codes for
 * @throws 403 - Invalid Permission level
 */
export async function getViewableHouseCodes(user:User): Promise<HouseCode[]>{
    const db = admin.firestore()
    switch(user.permissionLevel){
        case UserPermissionLevel.RHP:
            const rhpHouseCodeDocs = await db.collection(HouseCompetition.HOUSE_CODES_KEY).where(HouseCode.HOUSE, "==",user.house).get()
            const rhpHouseCodes = HouseCode.fromQuerySnapshot(rhpHouseCodeDocs)
            return rhpHouseCodes.filter((value) => (value.permissionLevel === UserPermissionLevel.RESIDENT || value.permissionLevel === UserPermissionLevel.FACULTY))
        case UserPermissionLevel.PROFESSIONAL_STAFF:
            return await getHouseCodes()
        case UserPermissionLevel.FACULTY:
            const houseCodeDocs = await db.collection(HouseCompetition.HOUSE_CODES_KEY).where(HouseCode.HOUSE, "==",user.house).get()
            const houseCodes = HouseCode.fromQuerySnapshot(houseCodeDocs)
            return houseCodes.filter((value) => (value.permissionLevel === UserPermissionLevel.RESIDENT))
        default:
            throw APIResponse.InvalidPermissionLevel()
    }

}