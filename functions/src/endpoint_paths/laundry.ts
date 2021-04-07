import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { getMachines } from '../src/GetMachines'
import { updateMachines } from '../src/UpdateMachines'
import APIUtility from './APIUtility'

if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}
const laundry_app = express()
const cors = require('cors')
const laundry_controls_main = express()

laundry_controls_main.use(laundry_app)
laundry_app.use(express.json())
laundry_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')


laundry_app.use(cors({origin:true}))
laundry_app.use(firestoreTools.flutterReformat)
// laundry_app.use(firestoreTools.validateFirebaseIdToken)

export const laundry_main = functions.https.onRequest(laundry_controls_main)

/**
 * Returns all machines and their statuses
 * 
 * @returns Machine[]
 * @throws  500 - Server Error
 */
laundry_app.get("/", async (req, res) => {
	try {
		const machines = await getMachines()
		res.status(APIResponse.SUCCESS_CODE).json({"machines": machines})
	}
	catch (error) {
		console.error("GET laundry/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})

/**
 * Update Machines
 * 
 * @returns Success
 * @throws  500 - Server Error
 */
laundry_app.put("/", async (req, res) => {
	try {
		APIUtility.authenticateRaspberryPi(req)
		APIUtility.validateRequest(req)
		await updateMachines(req.body)
		throw APIResponse.Success()
	}
	catch (error) {
		console.error("GET laundry/ failed with: " + error.toString())
		APIUtility.handleError(res, error)
	}
})