import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { getUser } from '../src/GetUser'
import { createLink } from '../src/CreateLink'
import { verifyUserHasCorrectPermission } from '../src/VerifyUserHasCorrectPermission'
import { getLinkById} from '../src/GetLinkById'
import { UserPermissionLevel } from '../models/UserPermissionLevel'
import { LinkUpdateOptions, updateLink } from '../src/UpdateLink'


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

    if(!req.query.id || req.query.id === ""){
        const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
    }
    else{
        try{
            res.status(APIResponse.SUCCESS_CODE).send(await getLinkById(req.query.id as string))
        }
        catch(suberror){
            if (suberror instanceof APIResponse){
                res.status(suberror.code).send(suberror.toJson())
            }
            else {
                console.log("FAILED WITH DB FROM link create ERROR: "+ suberror)
                const apiResponse = APIResponse.ServerError()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
        }
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

    if(req.body["single_use"] === undefined || req.body["point_id"] === undefined || req.body["description"] === undefined || req.body["is_enabled"] === undefined){
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
    }
    else{
        try{
            const user_id = req["user"]["user_id"]
            const description = req.body["description"]
            const point_id = parseInt(req.body["point_id"])
            const is_single_use = req.body["single_use"]
            const is_enabled = req.body["is_enabled"]

            const user = await getUser(user_id)
            const permissions = [UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.FACULTY, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.EXTERNAL_ADVISOR]
            verifyUserHasCorrectPermission(user, permissions)
            const link = await createLink(user,point_id, is_single_use, is_enabled, description)
            res.status(APIResponse.SUCCESS_CODE).send(link)
        }
        catch(suberror){
            if (suberror instanceof APIResponse){
                res.status(suberror.code).send(suberror.toJson())
            }
            else {
                console.log("FAILED WITH DB FROM link create ERROR: "+ suberror)
                const apiResponse = APIResponse.ServerError()
                res.status(apiResponse.code).send(apiResponse.toJson())
            }
        }
        
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
    if(req.body["link_id"] === undefined ){
		const error = APIResponse.MissingRequiredParameters()
		res.status(error.code).send(error.toJson())
    }
    else{
        let hasData = false
        const data:LinkUpdateOptions = {}
        if(req.body["archived"] !== undefined ){
            console.log("Updating archived");
            data.Archived = req.body["archived"]
            hasData = true
        }
        if(req.body["enabled"] !== undefined ){
            console.log("Updating enabled");
            data.Enabled = req.body["enabled"]
            hasData = true
        }
        if(req.body["description"] !== undefined ){
            if(req.body["description"] === ""){
                const error = APIResponse.IncorrectFormat()
                res.status(error.code).send(error.toJson())
            }
            else{
                console.log("Updating description");
                data.Description = req.body["description"]
                hasData = true
            }
        }
        if(req.body["singleUse"] !== undefined ){
            console.log("Updating single_use");
            data.SingleUse = req.body["singleUse"]
            hasData = true
        }
        if(hasData){
            try{
                const link = await getLinkById(req.body["link_id"])
                if(link.creatorId !== req["user"]["user_id"]){
                    const error = APIResponse.LinkDoesntBelongToUser()
                    res.status(error.code).send(error.toJson())
                }
                else{
                    await updateLink(req.body["link_id"] as string, data)
                    res.status(APIResponse.SUCCESS_CODE).send(APIResponse.Success().toJson())
                }
            }
            catch(suberror){
                if (suberror instanceof APIResponse){
                    res.status(suberror.code).send(suberror.toJson())
                }
                else {
                    console.log("FAILED WITH DB FROM link create ERROR: "+ suberror)
                    const apiResponse = APIResponse.ServerError()
                    res.status(apiResponse.code).send(apiResponse.toJson())
                }
            }
        }
        else{
            const error = APIResponse.MissingRequiredParameters()
		    res.status(error.code).send(error.toJson())
        }

    }
        
})