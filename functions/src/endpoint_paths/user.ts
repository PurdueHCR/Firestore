import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as bodyParser from "body-parser"
import { APIResponse } from '../models/APIResponse'
import { UnsubmittedPointLog } from '../models/UnsubmittedPointLog'
import { submitPoint } from '../src/SubmitPoints'
import { getUser } from '../src/GetUser'
import { createUser } from '../src/CreateUser'
import { isInDateRange } from '../src/IsInDateRange'
import { getUserRank } from '../src/GetUserRank'
import { getPointLogsForUser } from '../src/GetPointLogsForUser'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUserLinks } from '../src/GetUserLinks'

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const users_app = express()
const cors = require('cors')
const users_main = express()

users_main.use(users_app)
users_app.use(bodyParser.json())
users_app.use(bodyParser.urlencoded({ extended: true }))

const firestoreTools = require('../firestoreTools')

users_app.use(cors({origin:true}))
users_app.use(firestoreTools.flutterReformat)
users_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Get the houseRank and semesterRank for the requesting user
 * @returns UserRank
 * @throws 400 - NonExistantUser
 * @throws 401 - Unauthroized
 * @throws 500 - ServerError
 */
users_app.get('/auth-rank',  async (req, res) => {
	try{
		const rank = await getUserRank(req["user"]["user_id"])
		res.status(APIResponse.SUCCESS_CODE).send(rank.toJson())
	}
	catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})

/**
 * Creates a user
 * @returns User
 * @throws  401 - Unauthorized
 * @throws 	410 - HouseCodeDoesNotExist
 * @throws 	412 - UserAlreadyExists
 * @throws 	422 - MissingRequiredParameters
 * @throws 	500 - ServerError
 */
users_app.post('/create', async (req, res) => {
	//req["user"] is assigned in the FirebaseTools after user is authenticated
	if(req.query.first === null || req.query.last === null || req.query.code === null){
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else{
		try{
			const success = await createUser(req["user"]["user_id"], req.query.code as string, req.query.first as string, req.query.last as string)
			res.status(success.code).send(success.toJson())
		}
		catch(suberror){
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
	
})

/**
 * Return the user model for the firebase account noted in Authorization header
 * @returns User
 * @throws 	400 - NonExistantUser
 * @throws  401 - Unauthorized
 * @throws 	500 - ServerError 
 */
users_app.get('/get', async (req, res) => {
	console.log("Running /get")
	console.log(req.originalUrl)
	console.log(req.hostname)
	console.log(req.path)
	console.log(req.route)
	console.log(req.body)
	console.log(req.method)

	try{
		const user = await getUser(req["user"]["user_id"])
		res.status(APIResponse.SUCCESS_CODE).send(user.toJson())
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
 * Submit a point for this user
 * 
 * @throws  401 - Unauthorized
 * @throws  403 - Invalid Permission Level
 * @throws  412 - House Competition Is Disabled
 * @throws  418 - Point Type Is Disabled
 * @throws  419 - Users Can Not Self Submit This Point Type
 * @throws 	422 - Missing Required Parameters
 * @throws  500 - Server Error
 */
users_app.post('/submitPoint', async (req, res) => {
	if(!req.body || !req.body.point_type_id ||  req.body.point_type_id === "" || !req.body.description ||
	 req.body.description === "" || !req.body.date_occurred || req.body.date_occurred === ""){
		if(!req.body){
			console.error("Missing Body")
		}
		else if(!req.body.point_type_id || req.body.point_type_id === "" ){
			console.error("Missing point_type_id")
		}
		else if(!req.body.description || req.body.description === ""){
			console.error("Missing description")
		}
		else if(!req.body.date_occurred || req.body.date_occurred === ""){
			console.error("Missing date_occurred")
		}
		else{
			console.error("Unkown missing parameter??? This shouldnt be called")
		}
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else{
		console.log("DESCRIPTION: "+req.body.description)
		try{
			const date_occurred = new Date(req.body.date_occurred)
			if (isInDateRange(date_occurred)) {
				const log = new UnsubmittedPointLog(date_occurred, req.body.description, parseInt(req.body.point_type_id))
				let docID = null
				if (req.body.document_id) {
					docID = req.body.document_id
				}
				const didAddPoints = await submitPoint(req["user"]["user_id"], log, docID)
				const success = APIResponse.Success()
				if(didAddPoints){
					res.status(201).send(success.toJson())
				}
				else {
					res.status(202).send(success.toJson())
				}
				
			}
			else {
				const apiResponse = APIResponse.DateNotInRange()
				res.status(apiResponse.code).send(apiResponse.toJson())
			}
			
		}
		catch(error){
			console.error("FAILED WITH ERROR: "+ error.toString())
			if(error instanceof TypeError){
				const apiResponse = APIResponse.InvalidDateFormat()
				res.status(apiResponse.code).send(apiResponse.toJson())
			}
			else if(error instanceof APIResponse){
				res.status(error.code).send(error.toJson())
			}
			else{
				const apiResponse = APIResponse.ServerError()
				res.status(apiResponse.code).send(apiResponse.toJson())
			}
			
		}
	}

})


/**
 * Returns a list of point logs submitted by a user
 * 
 * @param query.limit	Optional query parameter. If provided, only return the <limit> most recently submitted points. Else return all submitted points
 * @param query.id	Optional query parameter. If provided, only return the point log with the given id
 * @throws 401 - Unauthorized
 * Any other errors you find while making this code
 * @throws 500 - ServerError
 */
users_app.get('/points', async (req, res) => {
	try {
		const user = await getUser(req["user"]["user_id"])
		if(user.permissionLevel === UserPermissionLevel.RESIDENT || user.permissionLevel === UserPermissionLevel.RHP
			|| user.permissionLevel === UserPermissionLevel.PRIVILEGED_RESIDENT
			){
				let pointLogs
				if(req.query.limit !== undefined){
					pointLogs = await getPointLogsForUser(user.id, user.house, parseInt(req.query.limit as string))
				}
				else{
					pointLogs = await getPointLogsForUser(user.id, user.house)
				}
				res.status(APIResponse.SUCCESS_CODE).send({points:pointLogs})
		}
		else {
			throw APIResponse.InvalidPermissionLevel()
		}
		
	}
	catch(error) {
		if (error instanceof APIResponse) {
			res.status(error.code).send(error.toJson())
		}
		else {
			console.log("FAILED WITH DB FROM user ERROR: " + error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
	}

})

/**
 * Gets all links that a user created
 * @throws 
 */
users_app.get('/links', async (req,res) => {
	try {
		const user = await getUser(req["user"]["user_id"])
		const links = await getUserLinks(user.id)
		res.status(APIResponse.SUCCESS_CODE).send({links:links})
	}
	catch(error) {
		if (error instanceof APIResponse) {
			res.status(error.code).send(error.toJson())
		}
		else {
			console.log("FAILED WITH DB FROM user ERROR: " + error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).send(apiResponse.toJson())
		}
	}
})

export const user_main = functions.https.onRequest(users_main)