import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { getSubmittablePointTypes } from '../src/GetSubmittablePointTypes'
import { getLinkablePointTypes } from '../src/GetLinkablePointTypes'
import { updatePointType } from '../src/UpdatePointType'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getPointTypes } from '../src/GetPointTypes'
import { createPointType } from '../src/CreatePointType'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getPointTypeById } from '../src/GetPointTypeById'
import APIUtility from './APIUtility'


//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const pt_app = express()
const cors = require('cors')
const pt_main = express()
const firestoreTools = require('../firestoreTools')

pt_main.use(pt_app)
pt_app.use(express.json())
pt_app.use(express.urlencoded({ extended: false }))



// competition_main is the object to be exported. export this in index.ts
export const pts_main = functions.https.onRequest(pt_main)

//setup Cors for cross site requests
pt_app.use(cors({origin:true}))
//Setup firestoreTools to validate user has been 
pt_app.use(firestoreTools.flutterReformat)
pt_app.use(firestoreTools.validateFirebaseIdToken)





/**
 * point_Type/ => returns all the point types. Only professional staff can use this endpoint
 *
 * @throws 400 - NonexistantUser
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 500 - ServerError
 */

pt_app.get('/', async (req, res) => { 
	try{
		APIUtility.validateRequest(req, true)
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])
		const user_pts = await getPointTypes()
		res.status(APIResponse.SUCCESS_CODE).json({point_types:user_pts})
	}
	catch(error){
		console.error("GET point_type/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
	}
})

/**
 * Update fields for a point type with the given id
 * @param req.body.id - required string id of the point type to replace
 * @param req.body.description - optional string new description of the point type
 * @param req.body.enabled - optional bool for if the point type is enabled
 * @param req.body.name - optional string new name for the point type
 * @param req.body.permissionLevel - optional PointTypePermissionLevel new permission level for the point type
 * @param req.body.residentsCanSubmit - optional bool update to this field
 * @param req.body.value - optional integer for the new value of the point type
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 417 - Unknown Point Type Id
 * @throws 422 - Missing Required Parametes
 * @throws 426 - Incorrect Format
 * @throws 500 - Server Error
 */
pt_app.put('/', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])

		if(!("description" in req.body || "enabled" in req.body || "name" in req.body || "permissionLevel" in req.body || "residentsCanSubmit" in req.body || "value" in req.body)){
			throw APIResponse.MissingRequiredParameters("At least one field must be provided to update: [description, enabled, name, permissionLevel, residentsCanSubmit, value]")
		}
		const id = APIUtility.parseInputForNumber(req.body,'id')
		const pointType = await getPointTypeById(id)
		if("description" in req.body){
			pointType.description = APIUtility.parseInputForString(req.body,'description')
		}
		if("enabled" in req.body){
			pointType.enabled = APIUtility.parseInputForBoolean(req.body,'enabled')
		}
		if("name" in req.body){
			pointType.name = APIUtility.parseInputForString(req.body,'name')
		}
		if("residentsCanSubmit" in req.body){
			pointType.residentsCanSubmit = APIUtility.parseInputForBoolean(req.body,'residentsCanSubmit')
		}
		if("permissionLevel" in req.body){
			pointType.permissionLevel = APIUtility.parseInputForNumber(req.body,'permissionLevel',1,3)
		}
		if("value" in req.body){
			pointType.value = APIUtility.parseInputForNumber(req.body,'value', 1)
		}
		await updatePointType(pointType)
		throw APIResponse.Success()

	}
	catch(error){
		console.error("PUT point_type/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
	}
})

/**
 * Create a point type
 * @param req.body.description - optional string new description of the point type
 * @param req.body.enabled - optional bool for if the point type is enabled
 * @param req.body.name - optional string new name for the point type
 * @param req.body.permissionLevel - optional PointTypePermissionLevel new permission level for the point type
 * @param req.body.residentsCanSubmit - optional bool update to this field
 * @param req.body.value - optional integer for the new value of the point type
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permission
 * @throws 422 - Missing Required Parametes
 * @throws 426 - Incorrect Format
 * @throws 500 - Server Error
 */
pt_app.post('/', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])

		const description = APIUtility.parseInputForString(req.body,'description')
		const enabled = APIUtility.parseInputForBoolean(req.body,'enabled')
		const name = APIUtility.parseInputForString(req.body,'name')
		const residentCanSubmit = APIUtility.parseInputForBoolean(req.body,'residentsCanSubmit')
		const level = APIUtility.parseInputForNumber(req.body,'permissionLevel', 1, 3)
		const value = APIUtility.parseInputForNumber(req.body,'value', 1)

		const type = await createPointType(description, enabled, name, residentCanSubmit, level, value)
		res.status(APIResponse.SUCCESS_CODE).json({point_type: type})

	}
	catch(error){
		console.error("POST point_type/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
	}
})

/**
 * point_type/submittable => returns all the point types which the user can use to create a point submission
 *
 * @throws 400 - NonexistantUser
 * @throws 401 - Unauthorized
 * @throws 500 - ServerError
 */

pt_app.get('/submittable', async (req, res) => { 
	try{
		APIUtility.validateRequest(req, true)
		const user = await APIUtility.getUser(req)
		const user_pts = await getSubmittablePointTypes(user)
		res.status(APIResponse.SUCCESS_CODE).json({point_types:user_pts})
		
	}
	catch(error){
		console.error("GET point_type/submittable failed with: " + error.toString())
        APIUtility.handleError(res, error)
	}
})

/**
 * point_type/linkable => returns all the point types which the user can use to create a link or qr code
 *
 * @throws 400 - NonexistantUser
 * @throws 401 - Unauthorized
 * @throws 500 - ServerError
 */

pt_app.get('/linkable', async (req, res) => { 
	try{
		APIUtility.validateRequest(req, true)
		const user = await APIUtility.getUser(req)
		const user_pts = await getLinkablePointTypes(user)
		res.status(APIResponse.SUCCESS_CODE).json({point_types:user_pts})
	}
	catch(error){
		console.error("GET point_type/ failed with: " + error.toString())
        APIUtility.handleError(res, error)
	}
})
