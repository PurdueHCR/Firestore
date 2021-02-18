import { UserPermissionLevel } from "../models/UserPermissionLevel"
import {User} from "../models/User"
import { APIResponse } from "../models/APIResponse"

/**
 * Verify that the user
 * @param user User model to check permission level
 * @param permissions List of permissions that are allowed
 * @throws 403 - InvalidPermissionLevel
 */
export function verifyUserHasCorrectPermission(user:User, permissions: UserPermissionLevel[]){
    if (!(permissions.includes(user.permissionLevel))){
        throw APIResponse.InvalidPermissionLevel()
    }
}