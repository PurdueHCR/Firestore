import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { Event } from '../models/Event'
import { addEvent } from '../src/AddEvent'

// Made sure that the app is only initialized one time
if (admin.apps.length == 0) {
    admin.initializeApp(functions.config().firebase)
}

const events_app = express()
const cors = require('cors')
const events_main = express()

events_main.use(events_app)
events_app.use(express.json())
events_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')
export const event_main = functions.https.onRequest(events_main)

events_app.use(cors({ origin:true }))
events_app.use(firestoreTools.flutterReformat)
events_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Add an Event
 * 
 * @throws  422 - Missing Required Parameters
 */
events_app.post('/add', async (req, res) => {
    
    if (!req.body || !req.body.name || req.body.name === "" || !req.body.details || req.body.details === ""
        || !req.body.date || req.body.date === "" || !req.body.location || req.body.location === ""
        || !req.body.points || req.body.points === "" || !req.body.house || req.body.house === "") {
            if (!req.body) {
                console.error("Missing Body")
            }
            else if (!req.body.name || req.body.name === "") {
                console.error("Missing name")
            }
            else if (!req.body.details || req.body.details === "") {
                console.error("Missing details")
            }
            else if (!req.body.date || req.body.date === "") {
                console.error("Missing date")
            }
            else if (!req.body.location || req.body.location === "") {
                console.error("Missing location")
            }
            else if (!req.body.points || req.body.points === "") {
                console.error("Missing points")
            }
            else if (!req.body.house || req.body.house === "") {
                console.error("Missing house")
            }
            const error = APIResponse.MissingRequiredParameters()
            res.status(error.code).send(error.toJson())
    } else {
        try {
            const event_date = new Date(req.body.date)
            // TODO: Function to check that date is in future
            const event = new Event(req.body.name, req.body.details, event_date,
                req.body.location, parseInt(req.body.points), req.body.house, req["user"]["user_id"], "")
            const didAddEvent = await addEvent(event)
            const success = APIResponse.Success()
            if (didAddEvent) {
                res.status(201).send(success.toJson())
            }
            else {
                res.status(202).send(success.toJson())
            }
        } catch (error) {
            console.error("FAILED WITH ERROR: " + error.toString())
            if (error instanceof TypeError) {
                const apiResponse = APIResponse.InvalidDateFormat()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
            else if (error instanceof APIResponse) {
                res.status(error.code).send(error.toJson())
            } else {
                const apiResponse = APIResponse.ServerError()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
        }
    }

    // Check that user is not resident in the next page
})