const VerifyUserHasCorrectPermission = require('../../src/src/VerifyUserHasCorrectPermission')
const User = require('../../src/models/User')
import {UserPermissionLevel} from '../../src/models/UserPermissionLevel'


//Test Suite GetUser
describe('Verify User Has Correct Permission', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('User permission in list', async() => {
        const resident = new User.User("","","","",0,UserPermissionLevel.RESIDENT, 0, "")
        const permissions = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, 
            UserPermissionLevel.FACULTY, UserPermissionLevel.PRIVILEGED_RESIDENT, 
            UserPermissionLevel.EXTERNAL_ADVISOR, UserPermissionLevel.RESIDENT]
        try{
            VerifyUserHasCorrectPermission.verifyUserHasCorrectPermission(resident,permissions)
        }
        catch (err){
            fail()
        }
    })

    //Test that a server error is correctly handled
    test('user permission not in list', async() => {
        const resident = new User.User("","","","",0,UserPermissionLevel.RHP, 0, "")
        const permissions = [UserPermissionLevel.RESIDENT, UserPermissionLevel.PROFESSIONAL_STAFF, 
            UserPermissionLevel.FACULTY, UserPermissionLevel.PRIVILEGED_RESIDENT, 
            UserPermissionLevel.EXTERNAL_ADVISOR]
        try{
            VerifyUserHasCorrectPermission.verifyUserHasCorrectPermission(resident,permissions)
            fail()
        }
        catch (err){
            
        }
    })

})
