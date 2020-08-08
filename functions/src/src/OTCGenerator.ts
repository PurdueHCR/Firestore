import * as functions from 'firebase-functions'
import { totp } from 'otplib'
import {APIResponse} from '../models/APIResponse'

/**
 * Generate a one time code based off of the secret from functions.config or the dev key
 */
export function generateOneTimeCode():string {
    let secret:string
    if(functions.config().otc === undefined || functions.config().otc.secret === ""){
        const data = require('../../development_keys/keys.json').otc
        secret = data.secret
    }
    else{
        secret = functions.config().otc.secret
    }
    //Set timeout to 5 minutes (60 * 5)
    totp.options = {step:300}
    return totp.generate(secret)
}

/**
 * Confirms a token against the saved secret. If the code is invalid, it will 
 * throw an Invalid One Time Code. If the code is valid, the function will end normally.
 * @param token 
 * @throws 405 - InvalidOneTimeCode
 */
export function verifyOneTimeCode(token:string){
    let isValid:boolean
    try {
        let secret:string
        if(functions.config().otc === undefined || functions.config().otc.secret === ""){
            secret = require('../../development_keys/keys.json').otc.secret
        }
        else{
            secret = functions.config().otc.secret
        }
        
        //Set timeout to 5 minutes (60 * 5)
        totp.options = {step:300}
        isValid =  totp.check(token, secret);
        
    } 
    catch (err) {
        console.error("Got eror when checking token: "+err)
        throw APIResponse.InvalidOneTimeCode()
    }
    if(!isValid){
        throw APIResponse.InvalidOneTimeCode()
    }
}