import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { updatePointLogStatus } from '../src/UpdatePointLogStatus'
import { getPointLogMessages } from '../src/GetPointLogMessages'
import { submitPointLogMessage } from '../src/SubmitPointLogMessage'
import { getPointLog } from '../src/GetPointLog'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { PointLogMessage } from '../models/PointLogMessage'
import { MessageType } from '../models/MessageType'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import APIUtility from './APIUtility'

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
 * 	@param body.approve specifies if the point log should be approved or rejected
 *  @param body.point_log_id specifies the point log to handle
 * 
 *  @throws 400 - Unknown User
 *  @throws 401 - Unauthorized
 *  @throws 403 - InvalidPermissionLevel
 *  @throws 412 - House Competition Disabled
 *  @throws 413 - UnknownPointLog
 *  @throws 416 - PointLogAlreadyHandled
 *  @throws 422 - Missing Required Parameters
 *  @throws 426 - Incorrect Format
 *  @throws 500 - Server Error
 */
logs_app.post('/handle', async (req, res) => {
	try{
		APIUtility.validateRequest(req)
		const approve = APIUtility.parseInputForBoolean(req.body, 'approve')
		const pointLogId = APIUtility.parseInputForString(req.body, 'point_log_id')
		if(approve){
			await updatePointLogStatus(approve, req["user"]["user_id"], pointLogId)
		}
		else{
			const message = APIUtility.parseInputForString(req.body, 'message')
			await updatePointLogStatus(approve, req["user"]["user_id"], pointLogId, message)
		}
		res.status(201).json(APIResponse.Success().toJson())
	}
	catch(error){
		console.error("POST point_log/handle failed with: " + error.toString())
		APIUtility.handleError(res, error)
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
	try {
		APIUtility.validateRequest(req)
		const logId = APIUtility.parseInputForString(req.body, 'log_id')
		const msg = APIUtility.parseInputForString(req.body, 'message')
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF])
		
		let house = ""
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			house = APIUtility.parseInputForString(req.body, 'house')
		}
		else{
			house = user.house
		}

		const pointLog = await getPointLog(user, house, logId)
		const message = new PointLogMessage(new Date(Date.now()), msg, MessageType.COMMENT, user.firstName, user.lastName, user.permissionLevel)
		
		await submitPointLogMessage(house, pointLog, message, [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF].includes(user.permissionLevel ))
		throw APIResponse.Success()
		

	} catch (error) {
		console.error("POST point_log/messages failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

logs_app.get('/messages', async (req, res) => {
	try {
		APIUtility.validateRequest(req)

		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP, UserPermissionLevel.RESIDENT, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.PROFESSIONAL_STAFF])

		const log_id = APIUtility.parseInputForString(req.query, 'log_id')

		let house = ""
		if(user.permissionLevel === UserPermissionLevel.PROFESSIONAL_STAFF){
			house = APIUtility.parseInputForString(req.query, 'house')
		}
		else{
			house = user.house
		}

		//Makes sure PointLog exists and user has permissions to edit
		await getPointLog(user, house, log_id)
		
		const messages = await getPointLogMessages(house,log_id)
		res.status(APIResponse.SUCCESS_CODE).json({messages:messages})
		
	} catch(error){
		console.error("GET point_log/messages failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})