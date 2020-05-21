import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { APIResponse } from '../models/APIResponse'
import { getAllRewards, getRewardById } from '../src/GetReward'

//Make sure that the app is only initialized one time 
if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}
const reward_app = express()
const cors = require('cors')
const reward_main = express()
const firestoreTools = require('../firestoreTools')

reward_main.use(reward_app)
reward_app.use(express.json())
reward_app.use(express.urlencoded({ extended: false }))



// competition_main is the object to be exported. export this in index.ts
export const rewards_main = functions.https.onRequest(reward_main)

//setup Cors for cross site requests
reward_app.use(cors({origin:true}))
//Setup firestoreTools to validate user has been 
reward_app.use(firestoreTools.flutterReformat)
reward_app.use(firestoreTools.validateFirebaseIdToken)


/**
 * use param.id. If it exists, then get the reward with that id. Otherwise just get all rewards
 * @param (optional) query.id
 * @throws 401 - Unauthorized
 * @throws 420 - Unknown Reward
 * @throws 500 - ServerError
 */
reward_app.get('/get', async (req, res) =>{
    try{
        if(req.query.id && req.query.id !== ""){
            const reward = await getRewardById(req.query.id as string)
            res.status(APIResponse.SUCCESS_CODE).send(reward)
        }
        else {
            const rewards = await getAllRewards()
            res.status(APIResponse.SUCCESS_CODE).send(rewards)
        }
    }
    catch (error){
        if( error instanceof APIResponse){
            res.status(error.code).send(error.toJson())
        }
        else {
            console.log("Unknown Error: "+error.toString())
            const apiResponse = APIResponse.ServerError()
            res.status(apiResponse.code).send(apiResponse.toJson())
        }
    }
})
