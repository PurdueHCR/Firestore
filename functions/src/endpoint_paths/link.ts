import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { createLink } from '../src/CreateLink'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getLinkById} from '../src/GetLinkById'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { LinkUpdateOptions, updateLink } from '../src/UpdateLink'
import APIUtility from './APIUtility'


if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}
const links_app = express()
const cors = require('cors')
const links_main = express()

links_main.use(links_app)
links_app.use(express.json())
links_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')

export const link_main = functions.https.onRequest(links_main)

links_app.use(cors({origin:true}))
links_app.use(firestoreTools.flutterReformat)
links_app.use(firestoreTools.validateFirebaseIdToken)

/**
 * Gets a link from an Id
 * @query id - string id for the Link
 * @throws 401 - Unauthorized
 * @throws 408 - Link Doesn't Exist
 * @throws 500 - Server Error
 */
links_main.get('/', async (req, res) => {

    try{
        APIUtility.validateRequest(req)
        const id = APIUtility.parseInputForString(req.query, 'id')
        res.status(APIResponse.SUCCESS_CODE).send(await getLinkById(id))
    }
    catch(error){
        console.error('Error in GET links/: '+error.toString())
        APIUtility.handleError(res,error)
    }

})

/**
 * Creates a link model in the database
 * @body single_use - Bool for link being single scan
 * @body point_id - number that represents id of the Point Type
 * @body description - string the description for the link
 * @throws 400 - User not found
 * @throws 401 - Unauthorized
 * @throws 403 - Invalid Permissions
 * @throws 417 - Unkown Point type
 * @throws 418 - Point Type Disabled
 * @throws 422 - Missing Required Parameters
 * @throws 430 - Insufficent Permissions for Point Type
 * @throws 500 - Server Error
 */
links_main.post('/create' ,async (req, res) => {

    try{
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        const permissions = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.FACULTY, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.EXTERNAL_ADVISOR]
        verifyUserHasCorrectPermission(user, permissions)
        
        const description = APIUtility.parseInputForString(req.body, 'description')
        const point_id = APIUtility.parseInputForNumber(req.body, 'point_id')
        const is_single_use = APIUtility.parseInputForBoolean(req.body, 'single_use')
        const is_enabled = APIUtility.parseInputForBoolean(req.body, 'is_enabled')

        
        const link = await createLink(user,point_id, is_single_use, is_enabled, description)
        res.status(APIResponse.SUCCESS_CODE).json(link)
    }
    catch(error){
        console.error('Error in POST links/create: '+error.toString())
        APIUtility.handleError(res,error)
    }
})

/**
 * Updates the link provided if the user is the owner
 * @body link_id - stringid of the link to update
 * @body archived - (Optional) bool for if the link is archived or not
 * @body enabled - (Optional) bool for if the link is enabled or not
 * @body description - (Optional) string for the description for the link
 * @body single_use - (Optional) bool for if the link can only be scanned once
 * @throws 401 - Unauthorized
 * @throws 407 - Link Doesn't Belong to User
 * @throws 408 - Link Doesn't Exist
 * @throws 422 - Missing Required Parameters
 * @throws 500 - Server Error
 */
links_main.put('/update' ,async (req, res) => {
    //Ensure that the link id exists so that it can be updated
    try{
        APIUtility.validateRequest(req)
        const user = await APIUtility.getUser(req)
        const linkId = APIUtility.parseInputForString(req.body, 'link_id')
        const link = await getLinkById(linkId)
        let hasData = false
        const data:LinkUpdateOptions = {}
        if("archived" in req.body ){
            console.log("Updating archived");
            data.Archived = APIUtility.parseInputForBoolean(req.body, 'archived')
            hasData = true
        }
        if("enabled" in req.body ){
            console.log("Updating enabled");
            data.Enabled = APIUtility.parseInputForBoolean(req.body, 'enabled')
            hasData = true
        }
        if("description" in req.body ){
            console.log("Updating description");
            data.Description = APIUtility.parseInputForString(req.body, 'description')
            hasData = true
        }
        if("singleUse" in req.body){
            console.log("Updating single_use");
            data.SingleUse = APIUtility.parseInputForBoolean(req.body, 'singleUse')
            hasData = true
        }
        if(hasData){
            
            if(link.creatorId !== user.id){
                throw APIResponse.LinkDoesntBelongToUser()
            }
            else{
                await updateLink(linkId, data)
                throw APIResponse.Success()
            }

        }
        else{
            throw APIResponse.MissingRequiredParameters()
        }
    }
    catch(error){
        console.error('Error in POST links/create: '+error.toString())
        APIUtility.handleError(res,error)
    }
        
})