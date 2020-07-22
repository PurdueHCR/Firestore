import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { getUser } from '../src/GetUser';
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission';
import { UserPermissionLevel } from '../models/UserPermissionLevel';
import { APIResponse } from '../models/APIResponse';
import { getViewableHouseCodes, getHouseCodeById } from '../src/GetHouseCodes';
import { refreshHouseCode, refreshHouseCodes } from '../src/RefreshHouseCode';
import { parseInputForString } from '../src/ParameterParser'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase);
}

const house_codes_app = express();
const cors = require('cors');
const house_codes_main = express();
const firestoreTools = require('../firestoreTools');

house_codes_main.use(house_codes_app);
house_codes_app.use(express.json());
house_codes_app.use(express.urlencoded({ extended: false }));




//setup Cors for cross site requests
house_codes_app.use(cors({origin:true}));
//Setup firestoreTools to validate user has been 
house_codes_app.use(firestoreTools.flutterReformat)
house_codes_app.use(firestoreTools.validateFirebaseIdToken);


/**
 * Get visible house codes for the user. RHPs can see codes for residents and FHPs in their house, FHPs can see codes for esidents in their house, and Prof staff can see all
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 500 - Server Error
 */
house_codes_app.get("/", async( req,res) => {
    try{
        const user = await getUser(req["user"]["user_id"])
        verifyUserHasCorrectPermission(user, [UserPermissionLevel.FACULTY, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.RHP])
        const codes = await getViewableHouseCodes(user)
        codes.sort((a,b) => {
            if(a.permissionLevel === b.permissionLevel){
                return (a.floorId >= b.floorId)?1:-1
            }
            else {
                return a.permissionLevel - b.permissionLevel
            }
        })
        res.status(APIResponse.SUCCESS_CODE).send({house_codes:codes})
    }
    catch (error) {
        if (error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        } else {
            console.log("FAILED TO GET HOUSE CODES WITH ERROR: "+ error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})

/**
 * Get visible house codes for the user. RHPs can see codes for residents and FHPs in their house, FHPs can see codes for esidents in their house, and Prof staff can see all
 * @param body.id - Id of the House code to reset
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 415 - Unknown House Code Id
 * @throws 426 - Incorrect Format
 * @throws 500 - Server Error
 */
house_codes_app.post("/refresh", async( req,res) => {
    try{

        if( "id" in req.body){
            const user = await getUser(req["user"]["user_id"])
            verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.RHP])
            const id = parseInputForString(req.body.id)
            const code = await getHouseCodeById(id)
            if(user.permissionLevel === UserPermissionLevel.RHP && code.house !== user.house){
                throw APIResponse.InvalidPermissionLevel()
            }
            await refreshHouseCode(code)
            res.status(APIResponse.SUCCESS_CODE).send({house_codes:[code]})
        }
        else{
            const user = await getUser(req["user"]["user_id"])
            verifyUserHasCorrectPermission(user, [UserPermissionLevel.PROFESSIONAL_STAFF])
            const codes = await getViewableHouseCodes(user)
            codes.sort((a,b) => {
                if(a.permissionLevel === b.permissionLevel){
                    return (a.floorId >= b.floorId)?1:-1
                }
                else {
                    return a.permissionLevel - b.permissionLevel
                }
            })
            await refreshHouseCodes(codes)
            res.status(APIResponse.SUCCESS_CODE).send({house_codes:codes})
        }
    }
    catch (error) {
        if (error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        } else {
            console.log("FAILED TO GET HOUSE CODES WITH ERROR: "+ error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})


// competition_main is the object to be exported. export this in index.ts
export const house_codes_function = functions.https.onRequest(house_codes_main);
