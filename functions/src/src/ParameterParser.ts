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
        return arg
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
        console.error("Could not parse boolean")
        throw APIResponse.MissingRequiredParameters()
    }
    else if(arg === 'false' || arg === 'true'){
        return arg === 'true'
    }
    else if(arg === true || arg === false){
        return arg
    }
    else{
        throw APIResponse.IncorrectFormat()
    }
}

/**
 * Makes sure that a field is a valid number
 * @param arg Value of field to parse (req.body.field or req.query.field)
 * @param min Optional exclusive minimum
 * @param max Optional exclusive maximum
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
        const value = arg
        if( value < min || value > max){
            throw APIResponse.IncorrectFormat()
        }
        return value
    }
    else{
        throw APIResponse.IncorrectFormat()
    }
}

/**
 * Parse the field for a date
 * @param arg Value of the field to parse for the date
 * @param minDate Optional Date minimum
 * @param maxDate Optional Date maximum
 * @throws 422 - Missing Required Parameters
 * @throws 423 - InvalidDateFormat
 * @throws 424 - DateNotInRange
 * @throws 500 - Server Error
 */
export function parseInputForDate(arg:any, minDate?:Date, maxDate?:Date): Date{
    if(arg === undefined || arg === null){
        console.error("Could not find date")
        throw APIResponse.MissingRequiredParameters()
    }
    else {
        let date:Date
        try{
            date = new Date(arg)
            console.log(date.toISOString())
        }
        catch(error){
			console.error("FAILED To Parse Date because of an error: "+ error.toString())
			if(error instanceof TypeError){
				throw APIResponse.InvalidDateFormat()
            }
            else if(error instanceof RangeError){
				throw APIResponse.InvalidDateFormat()
            }
            else{
                throw APIResponse.ServerError()
            }
        }
        if(maxDate && date > maxDate){
            throw APIResponse.DateNotInRange()
        }
        else if(minDate && date < minDate){
            throw APIResponse.DateNotInRange()
        }
        else{
            return date
        }
    }
}

/**
 * Parses the input for an array
 * @param arg Value of the field to parse for an array
 * @throws 422 - Missing Required Parameters
 * @throws 426 - Incorrect Format
 * @throws 500 - Server Error
 */
export function parseInputForArray(arg:any): any[] {
    if(arg === undefined || arg === null){
        //If you are sure that the array is defined, make sure that express.urlencoded({extended:true})
        console.error("The array was undefined")
        throw APIResponse.MissingRequiredParameters()
    }
    else {
        let array:any[]
        try{
            array = arg as any[]
            return array
        }
        catch(error){
			console.error("FAILED To Parse array because of an error: "+ error.toString())
			if(error instanceof TypeError){
				throw APIResponse.IncorrectFormat()
            }
            else{
                throw APIResponse.ServerError()
            }
        }
    }
}