import { APIResponse } from "../models/APIResponse"
import * as functions from 'firebase-functions'
import { getAllHouses } from "./GetHouses";
import { setHouses } from "./SetHouses";
import { User } from "../models/User";
import { createUserFromModel } from "./CreateUser";


/**
 * Reset the house competition to the defaults. The only user that will be saved is the user who made the request
 * @throws 500 - Server Error 
 */
export async function resetHouseCompetition(user:User){
    const firebase_tools = require("firebase-tools");

    //Retrieve all the objects that should be repopulated
    //We save this, because the delete below is recursive but we want to save the top level document
    const houses = await getAllHouses()

    let fb:{token:string}
        if(functions.config().fb === undefined || functions.config().fb.token === ""){
            fb = require('../../development_keys/keys.json').fb
        }
        else{
            fb = functions.config().fb
        }
	try {
        await firebase_tools.firestore.delete("Users", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });
        await firebase_tools.firestore.delete("House", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });
        await firebase_tools.firestore.delete("Links", {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: fb.token
        });


    }
	catch (err) {
		console.error("Error deleting the comeptition. " + err)
		throw APIResponse.ServerError()
    }

    for(const house of houses){
        house.totalPoints = 0
        house.houseAwards = []
    }

    //Repopulate the models
    await setHouses(houses)
    await createUserFromModel(user.id, user)


}