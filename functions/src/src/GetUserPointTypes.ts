import { PointType } from "../models/PointType"
import { APIResponse } from "../models/APIResponse"
import { User } from '../models/User'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getPointTypes } from './GetPointTypes'

/**
 * Get all the point types for a given user
 * 
 * @param user The user who is requesting the point types
 * @throws 500 - Server Error
 */
export async function getUserPointTypes(user:User) : Promise<PointType[]> {
	try {
		const pts = await getPointTypes()
		const user_pts: PointType[] = []
		pts.forEach((point_type) =>{
			if(point_type.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
				user_pts.push(point_type)
			}
			else if (point_type.enabled){
				if(point_type.userCanGenerateQRCodes(user.permissionLevel)){
					user_pts.push(point_type)
				}
				else if(point_type.residentCanSubmit){
					user_pts.push(point_type)
				}
			}
			
		})
		
		return Promise.resolve(user_pts)
	}
	catch (err) {
		console.log("GET Point type Error: " + err)
		return Promise.reject(APIResponse.ServerError())
	}
}