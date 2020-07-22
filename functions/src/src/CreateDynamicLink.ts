import * as UrlBuilder from 'build-url'
import * as functions from 'firebase-functions'
import * as request from 'request-promise'
import {Link} from '../models/Link'
import { APIResponse } from '../models/APIResponse';
import { HouseCode } from '../models/HouseCode';
import { UserPermissionLevel, getUserPermissionLevelAsString } from '../models/UserPermissionLevel';


/**
 * Create a firesbase dynamic link for a link
 * @param link Link to create a dynamic link for
 */
export async function makeDynamicLinkForLink(link:Link): Promise<string> {
    let applinks
    if(functions.config().applinks.key === undefined || functions.config().applinks.key === ""){
        applinks = require('../../development_keys/dynamic_link_keys.json')
    }
    else{
        applinks = functions.config().applinks
    }
    try{
        let longLink = UrlBuilder(`${applinks.dynamic_link_url}`, {
            queryParams: {
                link: `${applinks.main_app_url}`+"addpoints/"+link.id,
                ibi: "DecodeProgramming.HCRPoint",
                apn: "com.hcrpurdue.jason.hcrhousepoints",
                afl: `${applinks.main_app_url}`+"addpoints/"+link.id,
                ifl: `${applinks.main_app_url}`+"addpoints/"+link.id,
                st: link.description,
                sd: "Tap this link to get "+link.pointTypeValue + (link.pointTypeValue == 1)? " point!": " points!"
            }
        });

        console.log("LONG LINK: "+longLink)
        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${applinks.key}`,
            body: {
                "longDynamicLink": longLink,
                "suffix": {
                    "option": "UNGUESSABLE"
                }
            },
            json: true
        };
    
        const response = await request(options)
        console.log("Got response from post dynamic link: "+ response);
        return response.shortLink
    }
    catch (error) {
        console.error("Error creating Dynamic link: "+error)
        return Promise.reject(APIResponse.ServerError())
    }
}

export async function makeDynamicLinkForHouseCode(houseCode:HouseCode){
    let applinks
    if(functions.config().applinks.key === undefined || functions.config().applinks.key === ""){
        applinks = require('../../development_keys/dynamic_link_keys.json')
    }
    else{
        applinks = functions.config().applinks
    }

    let roleDescription = ""
    const permissionAsString = getUserPermissionLevelAsString(houseCode.permissionLevel)
    switch(houseCode.permissionLevel){
        case UserPermissionLevel.RESIDENT:
        case UserPermissionLevel.RHP:
        case UserPermissionLevel.PRIVILEGED_RESIDENT:
            roleDescription = "a " +houseCode.floorId +" "+ permissionAsString +" with "+houseCode.house+" House!"
            break
        case UserPermissionLevel.PROFESSIONAL_STAFF:
            roleDescription = permissionAsString+"!"
            break
        case UserPermissionLevel.FACULTY:
            roleDescription = "a" + permissionAsString+" with "+houseCode.house+" House!"
            break
        case UserPermissionLevel.EXTERNAL_ADVISOR:
            return "an "+permissionAsString+"!"
    }

    try{
        let longLink = UrlBuilder(`${applinks.dynamic_link_url}`, {
            queryParams: {
                link: `${applinks.main_app_url}`+"createaccount/"+houseCode.code,
                ibi: "DecodeProgramming.HCRPoint",
                apn: "com.hcrpurdue.jason.hcrhousepoints",
                afl: `${applinks.main_app_url}`+"createaccount/"+houseCode.code,
                ifl: `${applinks.main_app_url}`+"createaccount/"+houseCode.code,
                st: "Join the PurdueHCR House Competition!",
                sd: "Tap this link to register as "+roleDescription
            }
        });
        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${applinks.key}`,
            body: {
                "longDynamicLink": longLink,
                "suffix": {
                    "option": "UNGUESSABLE"
                }
            },
            json: true
        };
    
        const response = await request(options)
        console.log("Got response from post dynamic link: "+ response);
        return response.shortLink
    }
    catch (error) {
        console.error("Error creating Dynamic link: "+error)
        return Promise.reject(APIResponse.ServerError())
    }
}