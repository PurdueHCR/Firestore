import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
// import { APIResponse } from '../models/APIResponse'

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

export const link_main = functions.https.onRequest(laundry_controls_main)

laundry_app.use(cors({origin:true}))
laundry_app.use(firestoreTools.flutterReformat)
laundry_app.use(firestoreTools.validateFirebaseIdToken)

export const laundry_main = functions.https.onRequest(laundry_controls_main)

laundry_app.get("/", (req, res) => {
	res.status(501).send("Unimplemented")
})