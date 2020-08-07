import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { addEvent } from '../src/AddEvent'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUser } from '../src/GetUser'
import { getEvents } from '../src/GetEvents'
import { getPointTypeById } from '../src/GetPointTypeById'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getEventsByCreatorId } from '../src/GetEventsByCreatorId'
import { getEventById } from '../src/GetEventById'

// Made sure that the app is only initialized one time
if (admin.apps.length === 0) {
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
 * @param house house name for attending event
 * 
 * @throws 403 - Invalid Permission Level
 * @throws 412 - Competition Disabled
 * @throws 417 - Unknown Point Type
 * @throws 418 - Point Type Is Disabled
 * @throws 422 - Missing Required Parameters
 * @throws 424 - Date Not In Range
 * @throws 430 - Insufficient Permission Level For Create a Link with that Point Type
 * @throws 500 - Server Error
 */
events_app.post('/add', async (req, res) => {
    
    if (!req.body || !req.body.name || req.body.name === "" || !req.body.details || req.body.details === ""
        || !req.body.date || req.body.date === "" || !req.body.location || req.body.location === ""
        || !req.body.point_type_id || req.body.point_type_id === "" || !req.body.house || req.body.house === "") {
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
            else if (!req.body.point_type_id || req.body.point_type_id === "") {
                console.error("Missing point_type_id")
            }
            else if (!req.body.house || req.body.house === "") {
                console.error("Missing house")
            }
            const error = APIResponse.MissingRequiredParameters()
            res.status(error.code).send(error.toJson())
    } else {
        try {
            const system_preferences = await getSystemPreferences()
		    if(!system_preferences.isCompetitionEnabled) {
                const error = APIResponse.CompetitionDisabled()
                res.status(error.code).send(error.toJson())
                return
            }
            const user = await getUser(req["user"]["user_id"])
            const valid_users = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.EXTERNAL_ADVISOR,
                                UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.FACULTY]
            verifyUserHasCorrectPermission(user, valid_users)
            const type = await getPointTypeById(req.body.point_type_id)
            if (!type.canUserGenerateLinks(user.permissionLevel)) {
                const error = APIResponse.InsufficientPointTypePermissionForLink()
                res.status(error.code).send(error.toJson())
                return
            }
            if (!type.enabled) {
                const error = APIResponse.PointTypeDisabled()
                res.status(error.code).send(error.toJson())
                return
            }
            const event_date = new Date(req.body.date)
            const today = new Date()
            // Must set today to earliest possible time so event_date set to today's date will not error
            today.setHours(0,0,0,0)
            if (event_date < today) {
                const error = APIResponse.DateNotInRange()
                res.status(error.code).send(error.toJson())
            }
            await addEvent(req.body.name, req.body.details, event_date,
                req.body.location, type, req.body.house, user.id)
            res.status(200).send(APIResponse.Success())
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

/**
 * Get an Event by its ID
 * 
 * @param event_id id of the event
 * 
 * @throws 403 - Invalid Permission Level
 * @throws 422 - Missing Required Parameters
 * @throws 450 - Non-Existant Event
 * @throws 500 - Server Error
 * 
 * @returns an event
 */
events_app.get("/get_by_id", async (req, res) => {
    if (!req.query || !req.query.event_id || req.query.event_id === "") {
        if (!req.query) {
            console.error("Missing query")
        }
        else if (!req.query.event_id || req.query.event_id === "") {
            console.error("Missing event_id")
        }
        const error = APIResponse.MissingRequiredParameters()
        res.status(error.code).send(error.toJson())
    } else {
        try {
            const user = await getUser(req["user"]["user_id"])
            const event_log = await getEventById(req.query.event_id as string, user)
            res.status(APIResponse.SUCCESS_CODE).send({event:event_log})

        } catch (error) {
            console.error("FAILED WITH ERROR: " + error.toString())
            if (error instanceof APIResponse) {
                res.status(error.code).send(error.toJson())
            } else {
                const apiResponse = APIResponse.ServerError()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
        }
    }
})

/**
 * Get all events created by the user
 * 
 * @throws 500 - Server Error
 * 
 * @returns an array of events created by the user
 */
events_app.get('/get_by_creator_id', async (req, res) => {
    try {
        const user = await getUser(req["user"]["user_id"])
        const event_logs = await getEventsByCreatorId(user.id)
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

