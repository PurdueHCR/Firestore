import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { addEvent } from '../src/AddEvent'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { getUser } from '../src/GetUser'
import { getPointTypeById } from '../src/GetPointTypeById'
import { getSystemPreferences } from '../src/GetSystemPreferences'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'

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
		    if(!system_preferences.isHouseEnabled) {
                const error = APIResponse.CompetitionDisabled()
                res.status(error.code).send(error.toJson())
                return
            }
            let user = await getUser(req["user"]["user_id"])
            let valid_users = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.EXTERNAL_ADVISOR,
                                UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.FACULTY]
            verifyUserHasCorrectPermission(user, valid_users)
            let type = await getPointTypeById(req.body.point_type_id)
            if (!type.residentCanSubmit) {
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
            let today = new Date()
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