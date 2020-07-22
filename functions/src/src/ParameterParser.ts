import {APIResponse} from '../models/APIResponse'

/**
 * Makes sure that a field is a valid string
 * @param arg Value of field to parse (req.body.field or req.query.field)
 * @throws 422 - Missing Required Parameters
 * @throws 426 - Incorrect Format
 */
export function parseInputForString(arg:any): string {
    if(arg === undefined || arg === null ){
        throw APIResponse.MissingRequiredParameters()
    }
    else if(typeof arg !== 'string' || arg === ""){
        throw APIResponse.IncorrectFormat()
    }
    else{
        return arg as string
    }
}

/**
 * Makes sure that a field is a valid boolean
 * @param arg Value of field to parse (req.body.field or req.query.field)
 * @throws 422 - Missing Required Parameters
 * @throws 426 - Incorrect Format
 */
export function parseInputForBoolean(arg:any): boolean {
    if(arg === undefined || arg === null){
        throw APIResponse.MissingRequiredParameters()
    }
    else if(arg === 'false' || arg === 'true'){
        return arg === 'true'
    }
    else if(arg === true || arg === false){
        return arg as boolean
    }
    else{
        throw APIResponse.IncorrectFormat()
    }
}

/**
 * Makes sure that a field is a valid number
 * @param arg Value of field to parse (req.body.field or req.query.field)
 * @throws 422 - Missing Required Parameters
 * @throws 426 - Incorrect Format
 */
export function parseInputForNumber(arg:any, min:number = Number.MIN_SAFE_INTEGER, max:number = Number.MAX_SAFE_INTEGER): number {
    if(arg === undefined || arg === null){
        throw APIResponse.MissingRequiredParameters()
    }
    else if(typeof arg === 'string'){
        const value = parseInt(arg)
        if(isNaN(value)){
            throw APIResponse.IncorrectFormat()
        }
        else if( value < min || value > max){
            throw APIResponse.IncorrectFormat()
        }
        return value
    }
    else if(typeof arg === 'number'){
        const value = arg as number
        if( value < min || value > max){
            throw APIResponse.IncorrectFormat()
        }
        return value
    }
    else{
        throw APIResponse.IncorrectFormat()
    }
}