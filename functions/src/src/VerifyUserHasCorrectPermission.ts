import { UserPermissionLevel } from "../models/UserPermissionLevel"
import {User} from "../models/User"
import { APIResponse } from "../models/APIResponse"

/**
 * Verify that the user 
 * @param user_id 
 * @param permissions 
 */
export function verifyUserHasCorrectPermission(user:User, permissions: UserPermissionLevel[]){
    console.log("User permission level: "+user.toString())
    console.log("Permissions: "+permissions.toString())
    if (!(permissions.includes(user.permissionLevel))){
        throw APIResponse.InvalidPermissionLevel()
    }
}