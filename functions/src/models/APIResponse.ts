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

    static Success(): APIResponse {
        return new APIResponse(APIResponse.SUCCESS_CODE, "Success")
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
     * 409 - This Link Has Already Been Submitted
     * The Link/QR-code which was scanned is a single use code and this user has already scanned it
     */
    static LinkAlreadySubmitted(): APIResponse {
        return new APIResponse(409, "This Link Has Already Been Submitted")
    }

    /**
     * 410 - House Code Does Not Exist
     * House code does not exist in the database
     */
    static HouseCodeDoesNotExist(): APIResponse {
        return new APIResponse(410, "House Code Does Not Exist")
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
     */
    static MissingRequiredParameters(): APIResponse {
        return new APIResponse(422, "Missing Required Parameters")
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
     * Could not parse date format
     */
    static DateNotInRange(): APIResponse {
        return new APIResponse(424, "Date Is Not Allowed")
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
     */
    static IncorrectFormat(): APIResponse {
        return new APIResponse(426, "Data provided is in the incorrect format.")
    }

    /**
     * 430 - Insufficient Permission Level For Create a Link with that Point Type
     * The point type  
     */
    static InsufficientPointTypePermissionForLink(): APIResponse {
        return new APIResponse(430, "User does not have sufficient permissions to use that Point Type in a Link.")
    }

    /**
     * 500 - Server Error
     * Unknown Firebase Firestore error
     */
    static ServerError(): APIResponse {
        return new APIResponse(500, "Server Error")
    }
}