export class APIResponse{

    static SUCCESS_CODE = 200

    code:  number
    message:  string

    constructor(code: number, message: string){
        this.code = code;
        this.message = message;
    }

    toJson(){
        const data = {}
        data["message"] = this.toString() 
        return data;
    }

    toString(): string {
        return this.code+": "+this.message
    }

    /**
     * 200 - Success
     */
    static Success(): APIResponse {
        return new APIResponse(APIResponse.SUCCESS_CODE, "Success")
    }

    /**
     * 201 - Success Awaits Approval
     */
    static SuccessAwaitsApproval(): APIResponse {
        return new APIResponse(201, "Success")
    }

    /**
     * 202 - Success And Approved
     */
    static SuccessAndApproved(): APIResponse {
        return new APIResponse(202, "Success")
    }

    /**
     * 400 - User Does Not Exist
     * User model does not exist in the database
     */
    static NonExistantUser() : APIResponse {
        return new APIResponse(400, "User Does Not Exist")
    }

    /**
     * 401 - Unauthorized: Confirm The Token Is Valid.
     * Provided token failed login
     */
    static Unauthorized(): APIResponse {
        return new APIResponse(401, "Unauthorized: Confirm The Token Is Valid.")
    }

    /**
     * 402 - Unknown House Id
     * Id provided does not match a house in the database
     */
    static UnknownHouseId(): APIResponse {
        return new APIResponse(402, "Could not find House with that id.")
    }
    
    /**
     * 403 - This User does not have the correct permission levels.
     * User's permission level is not a level which is allowed to perform this action 
     */
    static InvalidPermissionLevel(): APIResponse {
        return new APIResponse(403, "This User does not have the correct permission levels.")
    }

    /**
     * 405 - The The provided one time code is either invalid or has expired.
     * Epired or Invlaid one time code
     */
    static InvalidOneTimeCode(): APIResponse {
        return new APIResponse(405, "The provided one time code is either invalid or has expired.")
    }

    /**
     * 406 - Link is Not Enabled
     * The Link is not enabled. It must be turned on by the owner.
     */
    static LinkIsNotEnabled(): APIResponse {
        return new APIResponse(407, "This link is not currently enabled. Talk to whoever gave you this link about enabling it.")
    }

    /**
     * 407 - Link Does not belong to current user
     * The Link/QR code does not belong to the current user so it can not be edited
     */
    static LinkDoesntBelongToUser(): APIResponse {
        return new APIResponse(407, "The Link does not belong to the current user")
    }

    /**
     * 408 - The Link does not exist
     * The Link/QR-code id does not exist
     */
    static LinkDoesntExist(): APIResponse {
        return new APIResponse(408, "The Link Could not be found")
    }

    /**
     * 409 - Points Already Claimed
     * Points were already claimed for this link or event
     */
    static PointsAlreadyClaimed(): APIResponse {
        return new APIResponse(409, "You already claimed points for this.")
    }

    /**
     * 410 - House Code Does Not Exist
     * House code does not exist in the database
     */
    static HouseCodeDoesNotExist(): APIResponse {
        return new APIResponse(410, "House Code Does Not Exist")
    }

    /**
     * 411 - Could Not Send Email
     * There was an error sending the email
     */
    static CouldNotSendEmail(): APIResponse {
        return new APIResponse(411, "Failed to send Email")
    }

    /**
     * 412 - House Competition Is Disabled
     * House Competition is disabled so the request may not be completed at this time
     */
    static CompetitionDisabled(): APIResponse {
        return new APIResponse(412, "House Competition Is Disabled")
    }

    /**
     * 413 - Unknown PointLog
     * The requested point cannot be found
     */
    static UnknownPointLog(): APIResponse {
        return new APIResponse(413, "Unkown PointLog")
    }

    /**
     * 414 - House Competition Must Be Disabled
     * The House Competition must be disabled to perform this action
     */
    static CompetitionMustBeDisabled(): APIResponse {
        return new APIResponse(414, "The House Competition must be disabled to perform this action")
    }

    /**
     * 415 - Unknown House Code Id
     * There is no House Code with the provided id. Make sure you use the Id field of the House Code and not the code field.
     */
    static UnknownHouseCodeId(): APIResponse {
        return new APIResponse(415, "There is no House Code with the provided id. Make sure you use the Id field of the House Code and not the code field.")
    }

    /**
     * 416 - PointLog Already Handled
     * The PointLog is already in the requested approved/rejected state
     */
    static PointLogAlreadyHandled(): APIResponse {
        return new APIResponse(416, "PointLog Already Handled")
    }

    /**
     * 417 - Unknown Point Type
     * Supplied Point Type Id does not exist in the database. This may occur if the point type is negative
     */
    static UnknownPointType(): APIResponse {
        return new APIResponse(417, "Unknown Point Type")
    }

    /**
     * 418 - Point Type Is Disabled
     * Point Type is not enabled for submissions at this time
     */
    static PointTypeDisabled(): APIResponse {
        return new APIResponse(418, "Point Type Is Disabled")
    }

    /**
     * 419 - Users Can Not Self Submit This Point Type
     * This point type does not allow users to self submit this point. IE it must be scanned through a link
     */
    static PointTypeSelfSubmissionDisabled(): APIResponse {
        return new APIResponse(419, "Users Can Not Self Submit This Point Type")
    }

    /**
     * 420 - Unknown Reward
     * Supplied Reward Id does not exist in the database.
     */
    static UnknownReward(): APIResponse {
        return new APIResponse(420, "Unknown Reward")
    }

    /**
     * 421 - User Already Exists
     * User with that ID already exists in the database
     */
    static UserAlreadyExists(): APIResponse {
        return new APIResponse(421, "User Already Exists")
    }

    /**
     * 422 - Missing Required Parameters
     * Required parameters for this endpoint does not exist
     * @param msg Optional message to send with missing parameters
     */
    static MissingRequiredParameters(msg?:any): APIResponse {
        if(msg){
            return new APIResponse(422, "Missing Required Parameters: "+msg)
        }
        else{
            return new APIResponse(422, "Missing Required Parameters")
        }
    }

    /**
     * 423 - Could Not Parse Date Format
     * Could not parse date format
     */
    static InvalidDateFormat(): APIResponse {
        return new APIResponse(423, "Could Not Parse Date Format")
    }

    /**
     * 424 - Date Is Not Allowed
     * Could not parse date format.
     * @param min Optional date for minimum allowed date
     * @param max Optional date for max allowed date
     */
    static DateNotInRange(min?:Date, max?:Date): APIResponse {
        let msg = "Date is not allowed."
        if(max && min){
            msg += ` [${min.toISOString()} < DATE < ${max.toISOString()}]`
        }
        else if(min){
            msg += ` [${min.toISOString()} < DATE]`
        }
        else if (max){
            msg += ` [DATE < ${max.toISOString()}]`
        }
        
        return new APIResponse(424, msg)
    }

    /**
     * 425 - Unknown House
     * Supplied House Name does not exist in the database.
     */
    static UnknownHouse(): APIResponse {
        return new APIResponse(425, "Unknown House")
    }

    /**
     * 426 - Incorrect Format
     * One or more fields provided were in an invalid format to save in the database
     * @param msg Optional message to send with incorrect Format
     */
    static IncorrectFormat(msg?:string): APIResponse {
        if(msg){
            return new APIResponse(426, "Data provided is in the incorrect format: "+msg)
        }
        else{
            return new APIResponse(426, "Data provided is in the incorrect format.")
        }
    }

    /**
     * 427 - Can Not Post Message
     * The user can not post a message to this point log
     */
    static CanNotPostMessage(): APIResponse {
        return new APIResponse(427, "You are not allowed to post a message to this submission.")
    }

    /**
     * 428 - Invalid Floor Id
     * The floor id does not exist with the house that the user belongs to.
     */
    static InvalidFloorId(): APIResponse {
        return new APIResponse(428, "The floor id does not exist with the house that the user belongs to.")
    }

    /**
     * 429 - Event Submissions Not Open
     * The event is not currently accepting event submissions.
     */
    static EventSubimssionsNotOpen(): APIResponse {
        return new APIResponse(429, `This event is not accepting submissions at this time.`)
    }

    /**
     * 430 - Insufficient Permission Level For Create a Link with that Point Type
     * The point type  
     */
    static InsufficientPointTypePermissionForLink(): APIResponse {
        return new APIResponse(430, "User does not have sufficient permissions to use that Point Type in a Link.")
    }

    /**
     * 431 - Can Not Access Point Log
     * This user does not have the corrent ownership or permission to access this point log
     */
    static CanNotAccessPointLog(): APIResponse {
        return new APIResponse(431, "This user does not have the correct ownership or permission to access this point log.")
    }

    /**
     * 432 - Can Not Access Event
     * This user does not have the correct ownership, permission, or invitation to access this event.
     */
    static CanNotAccessEvent(): APIResponse {
        return new APIResponse(432, "This user does not have the correct ownership, permission, or invitation to access this event.")
    }

    /**
     * 450 - Event Does Not Exist
     * The requested event cannot be found
     */
    static NonExistantEvent(): APIResponse {
        return new APIResponse(450, "The request event cannot be found.")
    }

    /**
     * 470 - Reward Already Exists
     * A reward with that id already exists.
     */
    static RewardAlreadyExists(): APIResponse {
        return new APIResponse(470, "A reward with that id already exists.")
    }

    /**
     * 500 - Server Error
     * Unknown Firebase Firestore error
     */
    static ServerError(): APIResponse {
        return new APIResponse(500, "Server Error")
    }
}