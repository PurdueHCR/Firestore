import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { getUser } from '../src/GetUser'
import { APIResponse } from '../models/APIResponse'
import { getSubmittablePointTypes } from '../src/GetSubmittablePointTypes'
import { getLinkablePointTypes } from '../src/GetLinkablePointTypes'
import { updatePointType } from '../src/UpdatePointType'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getPointTypes } from '../src/GetPointTypes'
import { createPointType } from '../src/CreatePointType'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getPointTypeById } from '../src/GetPointTypeById'
import * as ParameterParser from '../src/ParameterParser'


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
		const user = await getUser(req["user"]["user_id"])
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])
		const user_pts = await getPointTypes()
		res.status(APIResponse.SUCCESS_CODE).send({point_types:user_pts})
	}
	catch(error){
		if(error instanceof APIResponse){
			res.status(error.code).send(error.toJson())
		}
		else{
			console.log("FAILED WITH DB FROM user ERROR: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
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
		const user = await getUser(req["user"]["user_id"])
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])

		if(req.body === undefined || req.body.id === undefined || req.body.id === "" || 
		! ("description" in req.body || "enabled" in req.body || "name" in req.body || "permissionLevel" in req.body || "residentsCanSubmit" in req.body || "value" in req.body)){
			if(req.body === undefined){
				console.error("Missing body")
				throw APIResponse.MissingRequiredParameters()
			}
			else if(req.body.id === undefined || req.body.id === ""){
				console.error("Missing point type id")
				throw APIResponse.MissingRequiredParameters()
			}
			else{
				console.error("At least one field must have an update")
				throw APIResponse.MissingRequiredParameters()
			}
		}
		const id = ParameterParser.parseInputForNumber(req.body.id)
		const pointType = await getPointTypeById(id)
		if("description" in req.body){
			pointType.description = ParameterParser.parseInputForString(req.body.description)
		}
		if("enabled" in req.body){
			pointType.enabled = ParameterParser.parseInputForBoolean(req.body.enabled)
		}
		if("name" in req.body){
			pointType.name = ParameterParser.parseInputForString(req.body.name)
		}
		if("residentsCanSubmit" in req.body){
			pointType.residentsCanSubmit = ParameterParser.parseInputForBoolean(req.body.residentsCanSubmit)
		}
		if("permissionLevel" in req.body){
			pointType.permissionLevel = ParameterParser.parseInputForNumber(req.body.permissionLevel,1,3)
		}
		if("value" in req.body){
			pointType.value = ParameterParser.parseInputForNumber(req.body.value, 1)
		}
		console.log("Updating point type")
		await updatePointType(pointType)
		throw APIResponse.Success()

	}
	catch(error){
		if(error instanceof APIResponse){
			res.status(error.code).send(error.toJson())
		}
		else{
			console.log("FAILED WITH DB FROM user ERROR: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
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
		const user = await getUser(req["user"]["user_id"])
		verifyUserHasCorrectPermission(user,[UserPermissionLevel.PROFESSIONAL_STAFF])

		if(req.body === undefined || !("description" in req.body && "enabled" in req.body && "name" in req.body && "permissionLevel" in req.body && "residentsCanSubmit" in req.body && "value" in req.body)){
			if(req.body === undefined){
				console.error("Missing body")
			}
			else if("description" in req.body){
				console.error("Required Parameter missing: description")
			}
			else if("enabled" in req.body){
				console.error("Required Parameter missing: enabled")
			}
			else if("name" in req.body){
				console.error("Required Parameter missing: name")
			}
			else if("permissionLevel" in req.body){
				console.error("Required Parameter missing: permissionLevel")
			}
			else if("residentsCanSubmit" in req.body){
				console.error("Required Parameter missing: description")
			}
			else if("value" in req.body){
				console.error("Required Parameter missing: value")
			}
			else{
				console.error("Unkown missing parameter")
				
			}
			throw APIResponse.MissingRequiredParameters()
		}
		else{
			const description = ParameterParser.parseInputForString(req.body.description)
			const enabled = ParameterParser.parseInputForBoolean(req.body.enabled)
			const name = ParameterParser.parseInputForString(req.body.name)
			const residentCanSubmit = ParameterParser.parseInputForBoolean(req.body.residentsCanSubmit)
			const level = ParameterParser.parseInputForNumber(req.body.permissionLevel, 1, 3)
			const value = ParameterParser.parseInputForNumber(req.body.value, 1)


			
			const type = await createPointType(description, enabled, name, residentCanSubmit, level, value)
			res.status(APIResponse.SUCCESS_CODE).send({point_type: type})
			
		}

	}
	catch(error){
		if(error instanceof APIResponse){
			res.status(error.code).send(error.toJson())
		}
		else{
			console.log("FAILED WITH DB FROM user ERROR: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
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
		const user = await getUser(req["user"]["user_id"])
			const user_pts = await getSubmittablePointTypes(user)
			res.status(APIResponse.SUCCESS_CODE).send({point_types:user_pts})
		
	}
	catch(error){
		if(error instanceof APIResponse){
			res.status(error.code).send(error.toJson())
		}
		else{
			console.log("FAILED WITH DB FROM user ERROR: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
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
		const user = await getUser(req["user"]["user_id"])
		const user_pts = await getLinkablePointTypes(user)
		res.status(APIResponse.SUCCESS_CODE).send({point_types:user_pts})
	}
	catch(error){
		if(error instanceof APIResponse){
			res.status(error.code).send(error.toJson())
		}
		else{
			console.log("FAILED WITH DB FROM user ERROR: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
	}
})
