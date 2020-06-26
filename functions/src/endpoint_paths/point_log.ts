import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as bodyParser from "body-parser"
import { APIResponse } from '../models/APIResponse'
import { updatePointLogStatus } from '../src/UpdatePointLogStatus'

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

// const db = admin.firestore()
const log_app = express()
const cors = require('cors')
const logs_main = express()
const firestoreTools = require('../firestoreTools')

logs_main.use(log_app)
logs_main.use(bodyParser.json())
logs_main.use(bodyParser.urlencoded({ extended: false }))

export const log_main = functions.https.onRequest(logs_main)

log_app.use(cors({origin:true}))
log_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Handle a PointLog
 */
log_app.post('/handle', async (req, res) => {
	if (!req.body.approve || req.body.approve === "" || !req.body.approver_id || req.body.approver_id === ""
			|| !req.body.point_log_id || req.body.point_log_id === "") {
		if (!req.body) {
			console.error("Missing Body")
		}
		else if (!req.body.approve || req.body.approve === "") {
			console.error("Missing approve")
		}
		else if (!req.body.approver_id || req.body.approver_id === "") {
			console.error("Missing approver_id")
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
			const didUpdate = await updatePointLogStatus(should_approve, req.body.approver_id, req.body.point_log_id)
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
