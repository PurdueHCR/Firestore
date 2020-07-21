import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { getUser } from '../src/GetUser'
import { APIResponse } from '../models/APIResponse'
import { getSubmittablePointTypes } from '../src/GetSubmittablePointTypes'
import { getLinkablePointTypes } from '../src/GetLinkablePointTypes'
import { updatePointType } from '../src/UpdatePointType'
import { PointType } from '../models/PointType'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getPointTypes } from '../src/GetPointTypes'
import { getSystemPreferences } from '../src/GetSystemPreferences'


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
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			const user_pts = await getPointTypes()
			res.status(APIResponse.SUCCESS_CODE).send({point_types:user_pts})
		}
		else{
			const apiResponse = APIResponse.InvalidPermissionLevel()
			res.status(apiResponse.code).send(apiResponse.toJson())
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
		const system_preferences = await getSystemPreferences()
		if(system_preferences.isCompetitionEnabled){
			const user = await getUser(req["user"]["user_id"])
			const user_pts = await getSubmittablePointTypes(user)
			res.status(APIResponse.SUCCESS_CODE).send({point_types:user_pts})
		}
		else{
			const apiResponse = APIResponse.CompetitionDisabled()
			res.status(apiResponse.code).send(apiResponse.toJson())
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


/**
 * point_type/update => updates fields in the point type with the passed in ID
 * 
 * @throws  400 - UserDoesNotExist
 * @throws  401 - Unauthorized
 * @throws  403 - InvalidPermissionLevel
 * @throws 	422 - MissingRequiredParameters
 * @throws  426 - IncorrectFormat
 * @throws  500 - Server Error
 */
pt_app.put('/update', async (req, res) => {
	if (!req.query["id"]|| req.query["id"] === "") {
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else if ((await getUser(req["user"]["uid"])).permissionLevel !== UserPermissionLevel.PROFESSIONAL_STAFF) {
		const error = APIResponse.InvalidPermissionLevel()
		res.status(error.code).send(error.toJson())
	}
	else {
		let matches = false;
		for (const item in req.body) {
			// Check that the values attempting to be updated confirm to the allowed values
			const options = [PointType.DESCRIPTION, PointType.ENABLED, PointType.NAME,
			  				 PointType.PERMISSION_LEVEL, PointType.RESIDENTS_CAN_SUBMIT, PointType.VALUE]
			
			options.forEach(function (opt, index) {
				if (item === opt) {
					matches = true
				}
			});
		}
		if (!matches) {
			const error = APIResponse.IncorrectFormat()
			res.status(error.code).send(error.toJson())
		} else {
			try {
				const success = await updatePointType(req.query["id"].toString(), req.body)
				res.status(success.code).send(success.toJson())
			}
			catch(suberror) {
				if (suberror instanceof APIResponse){
					res.status(suberror.code).send(suberror.toJson())
				}
				else {
					console.log("FAILED WITH DB FROM user ERROR: "+ suberror)
					const apiResponse = APIResponse.ServerError()
					res.status(apiResponse.code).send(apiResponse.toJson())
				}
			}
		}
	}

})
