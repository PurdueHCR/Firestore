import {APIResponse} from '../models/APIResponse'
import { User } from '../models/User'
import { getUser } from '../src/GetUser'
export default class APIUtility {


    /**
     * Retrieves the User from the request
     * @param req Requet Body
     * @throws 400 - NonexistantUser
     */
    static async getUser(req:any): Promise<User> {
        return getUser(req["user"]["user_id"])
    }

    /**
     * Verifies that the request and query or body is defined (depending on GET or POST/PUT respectively)
     * @param req 
     * @param acceptEmptyInput (Optional) boolean for if the 
     * @throws 422 - Missing Required Parameters
     * @throws 499 - Invalid Content Type
     */
    static validateRequest(req:any, acceptEmptyInput:boolean = false){
        if(req === undefined || req === null ){
            console.error('The request was undefined or null')
            throw APIResponse.MissingRequiredParameters('The request was undefined or null')
        }
        else if(!acceptEmptyInput){
            if((req.method === "POST" || req.method === "PUT") && (req.body === undefined || req.body === null)){
                console.error(`The ${req.method} request came without a body, but a body is required`)
                throw APIResponse.MissingRequiredParameters(`The ${req.method} request came without a body, but a body is required`)
            }
            else if(req.method === "GET" && (req.query === undefined || req.query === null)){
                console.error(`The ${req.method} request came without query fields, but a query field is required`)
                throw APIResponse.MissingRequiredParameters(`The ${req.method} request came without query fields, but a query field is required`)
            }
            else if(req.method === "DELETE" && req.params === undefined || req.params === null){
                console.error(`The ${req.method} request came without an ID to delete`)
                throw APIResponse.MissingRequiredParameters(`The ${req.method} request came without query fields, but a query field is required`)
            }
        }
    }

    /**
     * Retrieves the field called 'name' from the 'location' as a string.
     * @param location Location of value to parse (req.body or req.query)
     * @param name Name of the variable to parse for
     * @throws 422 - Missing Required Parameters
     * @throws 426 - Incorrect Format
     */
    static parseInputForString(location:any, name:string): string {
        const arg = location[name]
        if(arg === undefined || arg === null ){
            throw APIResponse.MissingRequiredParameters(`[${name}]: string`)
        }
        else if(typeof arg !== 'string' || arg === ""){
            throw APIResponse.IncorrectFormat(`Correct format is [${name}]: string`)
        }
        else{
            return arg
        }
    }


    /**
     * Makes sure that a field is a valid boolean     
     * @param location Location of value to parse (req.body or req.query)
     * @param name Name of the variable to parse for
     * @throws 422 - Missing Required Parameters
     * @throws 426 - Incorrect Format
     */
    static parseInputForBoolean(location:any, name:string): boolean {
        const arg = location[name]
        if(arg === undefined || arg === null){
            throw APIResponse.MissingRequiredParameters(`[${name}]: boolean`)
        }
        else if(arg === 'false' || arg === 'true'){
            return arg === 'true'
        }
        else if(arg === true || arg === false){
            return arg
        }
        else{
            throw APIResponse.IncorrectFormat(`[${name}] has a type of ${typeof(arg)} with a value of ${arg}. Correct format is [${name}]: boolean`)
        }
    }

    /**
     * Makes sure that a field is a valid number
     * @param location Location of value to parse (req.body or req.query)
     * @param name Name of the variable to parse for
     * @param min Optional exclusive minimum
     * @param max Optional exclusive maximum
     * @throws 422 - Missing Required Parameters
     * @throws 426 - Incorrect Format
     */
    static parseInputForNumber(location:any, name:string, min:number = Number.MIN_SAFE_INTEGER, max:number = Number.MAX_SAFE_INTEGER): number {
        const arg = location[name]
        if(arg === undefined || arg === null){
            throw APIResponse.MissingRequiredParameters(`[${name}]: number`)
        }
        else if(typeof arg === 'string'){
            const value = parseInt(arg)
            if(isNaN(value)){
                throw APIResponse.IncorrectFormat(`Correct format is [${name}]: number`)
            }
            else if( value < min || value > max){
                throw APIResponse.IncorrectFormat(`The valid range is [${min},${max}]`)
            }
            return value
        }
        else if(typeof arg === 'number'){
            const value = arg
            if( value < min || value > max){
                throw APIResponse.IncorrectFormat(`The valid range is [${min},${max}]`)
            }
            return value
        }
        else{
            throw APIResponse.IncorrectFormat(`Correct format is [${name}]: boolean`)
        }
    }

    /**
     * Parse the field for a date
     * @param location Location of value to parse (req.body or req.query)
     * @param name Name of the variable to parse for
     * @param minDate Optional Date minimum
     * @param maxDate Optional Date maximum
     * @throws 422 - Missing Required Parameters
     * @throws 423 - InvalidDateFormat
     * @throws 424 - DateNotInRange
     * @throws 500 - Server Error
     */
    static parseInputForDate(location:any, name:string, minDate?:Date, maxDate?:Date): Date{
        const arg = location[name]
        if(arg === undefined || arg === null){
            throw APIResponse.MissingRequiredParameters(`[${name}]: Date/ISO String`)
        }
        else {
            let date:Date
            try{
                date = new Date(arg)
            }
            catch(error){
                console.error("FAILED To Parse Date because of an error: "+ error.toString())
                if(error instanceof TypeError){
                    throw APIResponse.InvalidDateFormat()
                }
                else if(error instanceof RangeError){
                    throw APIResponse.InvalidDateFormat()
                }
                else if(error.toString() === 'RangeError: Invalid time value'){
                    throw APIResponse.InvalidDateFormat()
                }
                else{
                    throw APIResponse.ServerError()
                }
            }
            if(date.toString() === 'Invalid Date'){
                throw APIResponse.InvalidDateFormat()
            }
            if(maxDate && date > maxDate){
                throw APIResponse.DateNotInRange(undefined,maxDate, name)
            }
            else if(minDate && date < minDate){
                throw APIResponse.DateNotInRange(minDate, undefined, name)
            }
            else{
                return date
            }
        }
    }

    /**
     * Parses the input for an array
     * @param location Location of value to parse (req.body or req.query)
     * @param name Name of the variable to parse for
     * @throws 422 - Missing Required Parameters
     * @throws 426 - Incorrect Format
     * @throws 500 - Server Error
     */
    static parseInputForArray(location:any, name:string): any[] {
        const arg = location[name]
        if(arg === undefined || arg === null){
            //If you are sure that the array is defined, make sure that express.urlencoded({extended:true})
            throw APIResponse.MissingRequiredParameters(`[${name}]: any[]`)
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
                    throw APIResponse.IncorrectFormat(`Correct format is [${name}]: any[]`)
                }
                else{
                    throw APIResponse.ServerError()
                }
            }
        }
    }

    /**
     * Handle the error and send the correct response
     * @param res The response object of the express app
     * @param error The error that was caught
     */
    static handleError(res:any, error:any){
        if(error instanceof APIResponse){
			res.status(error.code).json(error.toJson())
        }
		else{
			console.log("APIUtility is handling an unhandled error: "+ error)
			const apiResponse = APIResponse.ServerError()
			res.status(apiResponse.code).json(apiResponse.toJson())
		}
    }
}