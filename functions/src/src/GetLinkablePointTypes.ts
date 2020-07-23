import { PointType } from "../models/PointType"
import { APIResponse } from "../models/APIResponse"
import { User } from '../models/User'
import { getPointTypes } from './GetPointTypes'
import { UserPermissionLevel } from "../models/UserPermissionLevel"

/**
 * Get all the point types for a given user
 * 
 * @param user The user who is requesting the point types
 * @throws 500 - Server Error
 */
export async function getLinkablePointTypes(user:User) : Promise<PointType[]> {
	const user_pts: PointType[] = []
	if(user.permissionLevel !== UserPermissionLevel.RESIDENT ){
			try {
				const pts = await getPointTypes()
				pts.forEach((point_type) =>{
					if (point_type.enabled && point_type.canUserGenerateLinks(user.permissionLevel)){
						user_pts.push(point_type)
					}
				})
				
				return Promise.resolve(user_pts)
			}
			catch (err) {
				console.log("GET Point type Error: " + err)
				return Promise.reject(APIResponse.ServerError())
			}
	}
	return Promise.resolve(user_pts)
}