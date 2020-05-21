import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'


if(admin.apps.length === 0){
	admin.initializeApp(functions.config().firebase)
}

const houses_app = express()
const cors = require('cors')
const houses_main = express()

houses_main.use(houses_app)
houses_app.use(express.json())
houses_app.use(express.urlencoded({ extended: false }))

const firestoreTools = require('../firestoreTools')

export const house_main = functions.https.onRequest(houses_main)


houses_app.use(cors({origin:true}))
houses_app.use(firestoreTools.flutterReformat)
houses_app.use(firestoreTools.validateFirebaseIdToken)



/**
 * Returns a list of houses.
 * 
 * @param req.query.id  Optional query parameter , id, which if provided designates the firebaseid of the house to return. If no id is provided, return all the houses
 * @returns House[]
 * @throws 401 - Unauthorized - Dont wory about implementing this one. It will be thrown automatically if the token is invalid
 * @throws 402 - UnknownHouseId - Thrown if the House id does not exist in the database
 * @throws 500 - ServerError
 */
houses_main.get('/get', (req, res) => {
    //Create a function in the src folder for getting all houses or getting a house by id.
    //Depending on if an id was passed in or not, return an array with only one house or all houses
    // HINT: Look at reward/get for examples
    // GetHouseByName.ts is already created. Use that function when an id is provided
})