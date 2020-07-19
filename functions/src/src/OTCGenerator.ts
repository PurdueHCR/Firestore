import * as functions from 'firebase-functions'
import { authenticator } from 'otplib'
import {APIResponse} from '../models/APIResponse'

/**
 * Generate a one time code based off of the secret from functions.config or the dev key
 */
export function generateOneTimeCode():string {
    let secret:string
    if(functions.config().otc.secret === undefined || functions.config().otc.secret === ""){
        secret = require('../../development_keys/otc_secret.json')["secret"]
    }
    else{
        secret = functions.config().otc.secret
    }
    return authenticator.generate(secret)
}

/**
 * Confirms a token against the saved secret. If the code is invalid, it will 
 * throw an Invalid One Time Code. If the code is valid, the function will end normally.
 * @param token 
 * @throws InvalidOneTimeCode
 */
export function verifyOneTimeCode(token:string){
    let isValid:boolean
    try {
        let secret:string
        if(functions.config().otc.secret === undefined || functions.config().otc.secret === ""){
            secret = require('../../development_keys/otc_secret.json')["secret"]
        }
        else{
            secret = functions.config().otc.secret
        }
    
         isValid =  authenticator.check(token, secret);
        
    } 
    catch (err) {
        throw APIResponse.InvalidOneTimeCode()
    }
    if(!isValid){
        throw APIResponse.InvalidOneTimeCode()
    }
}