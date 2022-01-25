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
import { updatePointLogType } from '../src/UpdatePointLogType'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import APIUtility from './APIUtility'
import { getPointTypeById } from '../src/GetPointTypeById'

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

/**
 * Update the point type associated with a point submission
 * @param log_id the id for the log to update the PointType of
 * @param new_point_type_id the new PointType for the log
 * 
 * @throws 400 – Unknown Error
 * @throws 401 – Unauthorized
 * @throws 403 – Invalid Permission Level
 * @throws 412 - House Competition Disabled
 * @throws 413 - Unknown Point Log
 * @throws 417 - Unknown Point Type
 * @throws 422 - Missing required parameters
 * @throws 500 - Server Error
 * 
 */
logs_app.post('/updateSubmissionPointType' , async (req, res) => {

	try {
		APIUtility.validateRequest(req)
		
		const user = await APIUtility.getUser(req)
		verifyUserHasCorrectPermission(user, [UserPermissionLevel.RHP])
		let house = user.house

		const logId = APIUtility.parseInputForString(req.body, 'log_id')

		const pointLog = await getPointLog(user, house, logId)

		const newPointTypeId = APIUtility.parseInputForNumber(req.body, 'new_point_type_id')

		const oldPointType = await getPointTypeById(Math.abs(pointLog.pointTypeId))
        const newPointType = await getPointTypeById(newPointTypeId)
		await updatePointLogType(oldPointType, newPointType, logId, house)

		// Add message to log saying that it has been updated
		
		let msg = "Point submission changed from type '" + oldPointType.name + "' to type '" + newPointType.name + "'"
		const message = new PointLogMessage(new Date(Date.now()), msg, MessageType.COMMENT, user.firstName, user.lastName, user.permissionLevel)
		await submitPointLogMessage(house, pointLog, message, true)

		throw APIResponse.Success()

	} catch (error) {
		console.error("PUT point_log/updateSubmissionPointType failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}

})



/**
 * Get a point log by it's ID. Can be useful when need to check for updates on a log
 * @param log_id the id of the log to retrieve
 * 
 * @throws 400 – Unknown Error
 * @throws 413 - Unknown Point Log
 * @throws 422 - Missing required parameters
 * @throws 500 - Server Error
 * 
 */
logs_app.get('/getPointLogById', async (req, res) => {
	try {
		APIUtility.validateRequest(req)

		const user = await APIUtility.getUser(req)
		let house = user.house
		const logId = APIUtility.parseInputForString(req.query, 'log_id')

		const pointLog = await getPointLog(user, house, logId)

		res.status(APIResponse.SUCCESS_CODE).json({pointLog: pointLog.toFirebaseJSON()})
	} catch (error) {
		console.error("GET point_log/getPointLogById failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})
