import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { updatePointLogStatus } from '../src/UpdatePointLogStatus'
import { getPointLogMessages } from '../src/GetPointLogMessages'
import { submitPointLogMessage } from '../src/SubmitPointLogMessage'
import { getUser } from '../src/GetUser'
import { getPointLog } from '../src/GetPointLog'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { PointLogMessage } from '../models/PointLogMessage'
import { MessageType } from '../models/MessageType'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}


const logs_app = express()
const cors = require('cors')
const logs_main = express()

logs_main.use(logs_app)
logs_app.use(express.json())
logs_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')
export const log_main = functions.https.onRequest(logs_main)

logs_app.use(cors({origin:true}))
logs_app.use(firestoreTools.flutterReformat)
logs_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Handle a PointLog
 * 
 *  @throws  422 - MissingRequiredParameters
 *  @throws  426 - IncorrectFormat
 */
logs_app.post('/handle', async (req, res) => {
	console.log('req is', req)
	if (!req.body || !req.body.approve || req.body.approve === ""
			|| !req.body.point_log_id || req.body.point_log_id === "") {
		if (!req.body) {
			console.error("Missing Body")
		}
		else if (!req.body.approve || req.body.approve === "") {
			console.error("Missing approve")
		}
		else if (!req.body.point_log_id || req.body.point_log_id === "") {
			console.error("Missing point_log_id")
		} else {
			console.error("Unknown missing parameter")
		}
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else if (req.body.approve != "false" && req.body.approve != "true") {
		console.error("Invalid approve")
		const error = APIResponse.IncorrectFormat()
		res.status(error.code).send(error.toJson())
	} else {
		try {
			var should_approve = (req.body.approve == 'true');
			const didUpdate = await updatePointLogStatus(should_approve, req["user"]["user_id"], req.body.point_log_id)
			if (didUpdate) {
				res.status(201).send(APIResponse.Success().toJson())
			}
		} catch (error) {
			console.log("FAILED WITH ERROR: "+ error.toString())
			if (error instanceof APIResponse){
				res.status(error.code).send(error.toJson())
			} else {
				const apiResponse = APIResponse.ServerError()
				res.status(apiResponse.code).send(apiResponse.toJson())
			}
		}
	}
})

/**
 * Post a message to a point log
 * @param body.log_id the id for the log to post the message to 
 * @param body.message the message to post
 * 
 * @throws 400 - Unknown User
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid permission level
 * @throws 413 - Unknown Point Log
 * @throws 422 - Missing required parameters
 * @throws 500 - Server Error
 * 
 */
logs_app.post('/messages', async (req, res) => {
	if(!req.body.log_id || req.body.log_id === "" || !req.body.message || req.body.message === ""){
		if(!req.body.log_id){
			console.log("Missing field: log_id")
		}
		else if(!req.body.message){
			console.log("Missing field: message")
		}
		else{
			console.log("WTF")
			console.log(req.body.log_id)
			console.log(req.body.message)
		}
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else {
		try {
			const user = await getUser(req["user"]["user_id"])
			verifyUserHasCorrectPermission(user, [UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP])
			const pointLog = await getPointLog(user, req.body.log_id as string)
			const message = new PointLogMessage(new Date(Date.now()), req.body.message as string, MessageType.COMMENT, user.firstName, user.lastName, user.permissionLevel)
			
			await submitPointLogMessage(user.house, pointLog, message, user.permissionLevel === UserPermissionLevel.RHP)
			res.status(APIResponse.SUCCESS_CODE).send(APIResponse.Success())
			

		} catch (error) {
			console.log("FAILED TO POST NEW MESSAGE WITH ERROR: "+ error.toString())
			if (error instanceof APIResponse){
				res.status(error.code).send(error.toJson())
			} else {
				const apiResponse = APIResponse.ServerError()
				res.status(apiResponse.code).send(apiResponse.toJson())
			}
		}
	}
})

logs_app.get('/messages', async (req, res) => {
	console.log("IN MESSAGES GET ENDPOINT")
	if(!req.query.log_id || req.query.log_id === "" ){
		console.log("Missing field: log_id")
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
	}
	else {
		try {
			const messages = await getPointLogMessages(req["user"]["user_id"], req.query.log_id as string)
			res.status(APIResponse.SUCCESS_CODE).send({messages:messages})
			
		} catch(suberror){
            if (suberror instanceof APIResponse){
                res.status(suberror.code).send(suberror.toJson())
            }
            else {
                console.log("FAILED WITH DB FROM get messages ERROR: "+ suberror)
                const apiResponse = APIResponse.ServerError()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
        }
	}
})