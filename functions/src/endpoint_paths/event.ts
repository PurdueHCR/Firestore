import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { addEvent } from '../src/AddEvent'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUser } from '../src/GetUser'
import { getEvents } from '../src/GetEvents'

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
 * @param name event name
 * @param details event details
 * @param date event date
 * @param location event location string
 * @param points number of points for attending the event
 * @param point_type_id id of the PointType associated with the event
 * @param point_type_name name of the PointType associated with the event
 * @param point_type_description description of the PointType associated with the event
 * @param house house name for attending event
 * 
 * @throws 403 - Invalid Permission Level
 * @throws 422 - Missing Required Parameters
 * @throws 424 - Date Not In Range
 * @throws 500 - Server Error
 */
events_app.post('/add', async (req, res) => {
    
    if (!req.body || !req.body.name || req.body.name === "" || !req.body.details || req.body.details === ""
        || !req.body.date || req.body.date === "" || !req.body.location || req.body.location === ""
        || !req.body.points || req.body.points === "" || !req.body.point_type_id || req.body.point_type_id === ""
        || !req.body.point_type_name || req.body.point_type_name === "" || !req.body.point_type_description
        ||req.body.point_type_description === "" || !req.body.house || req.body.house === "") {
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
            else if (!req.body.point_type_id || req.body.point_type_id === "") {
                console.error("Missing point_type_id")
            }
            else if (!req.body.point_type_name || req.body.point_type_name === "") {
                console.error("Missing point_type_name")
            }
            else if (!req.body.point_type_description || req.body.point_type_description === "") {
                console.error("Missing point_type_description")
            }
            else if (!req.body.house || req.body.house === "") {
                console.error("Missing house")
            }
            const error = APIResponse.MissingRequiredParameters()
            res.status(error.code).send(error.toJson())
    } else {
        try {
            let user = await getUser(req["user"]["user_id"])
            if (user.permissionLevel === UserPermissionLevel.RESIDENT) {
                const error = APIResponse.InvalidPermissionLevel()
                res.status(error.code).send(error.toJson())
                return
            }
            const event_date = new Date(req.body.date)
            let today = new Date()
            // Must set today to earliest possible time so event_date set to today's date will not error
            today.setHours(0,0,0,0)
            if (event_date < today) {
                const error = APIResponse.DateNotInRange()
                res.status(error.code).send(error.toJson())
            }
            const didAddEvent = await addEvent(req.body.name, req.body.details, event_date,
                req.body.location, parseInt(req.body.points), req.body.point_type_id, req.body.point_type_name,
                req.body.point_type_description, req.body.house, user.id)
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

/**
 * Get all events available to the user
 * 
 * @throws 500 - Server Error
 */
events_app.get('/', async (req, res) => {

    try {
        const user = await getUser(req["user"]["user_id"])
        const event_logs = await getEvents(user)
        res.status(APIResponse.SUCCESS_CODE).send({events:event_logs})
    } catch (error) {
        console.error("FAILED WITH ERROR: " + error.toString())
        if (error instanceof APIResponse) {
            res.status(error.code).send(error.toJson())
        } else {
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})
