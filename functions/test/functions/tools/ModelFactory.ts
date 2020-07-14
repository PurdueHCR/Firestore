///-----------------------------------------------------------------
///   Description:    Tool to help make models used in the real API for testing.
///   Author:         Brian Johncox                    Date: 7/13/2020
///   Notes:          
///                   - These functions create models to be passed to functions for unit testing. This is NOT a factory to mock the models to be returned from admin.firestore
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------

import {User} from '../../../src/models/User'
import * as Options from "../../OptionDeclarations"

/**
 * Create a User model that matches the User model used in the API for unit testing functions.
 * Note: This is not a mocked model and should not be returned in the mocking of the admin.Firestore
 * @param id id of the user to create
 * @param permission_level number for the permission level of the user
 * @param uOpts Optional parameters to set for the users
 */
export function createUser(id: string, permission_level: number, uOpts:Options.UserOptions = Options.USER_DEFAULTS): User {
    const first = (uOpts.first !== undefined)? uOpts.first: Options.USER_DEFAULTS.first!
    const floor_id = (uOpts.floor_id !== undefined)? uOpts.floor_id:Options.USER_DEFAULTS.floor_id!
    const house = (uOpts.house_name !== undefined)? uOpts.house_name:Options.USER_DEFAULTS.house_name!
    const last = (uOpts.last !== undefined)? uOpts.last:Options.USER_DEFAULTS.last!
    const sem_points = (uOpts.semester_points !== undefined)? uOpts.semester_points: Options.USER_DEFAULTS.semester_points!
    const points = (uOpts.total_points !== undefined)? uOpts.total_points: Options.USER_DEFAULTS.total_points!
    switch(permission_level){
        case 0:
            // Resident
            return new User(first,floor_id,house,last,sem_points,permission_level,points,id)
        case 1:
            //RHP
            return new User(first,floor_id,house,last,sem_points,permission_level,points,id)
        case 2:
            //REC
            return new User(first,"","",last,-1,permission_level,-1,id)
        case 3:
            //FHP
            return new User(first,"",house,last,-1,permission_level,-1,id)
        case 4:
            //Privileged Resident
            return new User(first,floor_id,house,last,sem_points,permission_level,points,id)
        case 5:
            //Non-Honors Affiliated Staff
            return new User(first,"","",last,-1,permission_level,-1,id)
        default:
            return new User(first,floor_id,house,last,sem_points,permission_level,points,id)
    }
}