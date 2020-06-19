/**
 * Mock function that returns a Promise that resolves a 
 * FirebaseDocument with the provided data and id
 * 
 * @param id Id for the mocked document
 * @param data {} for the mocked object.
 */
export function mockFirebaseDocumentRequest(data: DocumentData): Function {
    const mockDocumentRequest = jest.fn()
    mockDocumentRequest.mockResolvedValue(Promise.resolve(mockDocument(data)))
    return mockDocumentRequest
}

export type DocumentData = {
    id: String,
    data: any
}

function mockDocument(data:DocumentData){
    return {
        exists: true,
        id: data.id,
        data: () => (data.data)
    }
}

function mockDocuments(documents:DocumentData[]){
    let data:any[] = []
    for(const doc of documents){
        data.push(mockDocument(doc))
    }
    return data
}

/**
 * Mock function that returns a Promise that resolves a 
 * FirebaseQueryRequest
 * 
 * @param id Id for the mocked document
 * @param data {} for the mocked object.
 */
export function mockFirebaseQueryRequest(documents: DocumentData[]): Function {
    const mockQueryRequest = jest.fn()
    mockQueryRequest.mockResolvedValue(Promise.resolve({
        docs: mockDocuments(documents)
    }))
    return mockQueryRequest
}


/**
 * Mock function which returns a Promise with a resolved object 
 * that has exists = false
 */
export function mockDocumentDoesntExist(): Function {
    const mockDocumentDoesntExistRequest = jest.fn()
    mockDocumentDoesntExistRequest.mockResolvedValue(Promise.resolve({
        exists: false,
        id: "",
        data: () => {}
    }))
    return mockDocumentDoesntExistRequest
}

/**
 * Mock function which returns a Promise with a rejected error
 */
export function mockServerError(): Function {
    const mockServerErrorRequest = jest.fn()
    mockServerErrorRequest.mockRejectedValue("Firebase Error")
    return mockServerErrorRequest
}

export function mockPointType(id:number, description: String, enabled: boolean, name: String,
    permissionLevel: number, residentsCanSubmit: boolean, value:number) : DocumentData {
    return {
        id:id.toString(),
        data: {
            Description:description,
            Enabled:enabled,
            Name:name,
            PermissionLevel:permissionLevel,
            ResidentsCanSubmit:residentsCanSubmit,
            Value:value
        }
    }
}


export function mockPointLog(resident_id:string, log_id:string, date_occurred:Date, approved:boolean = false, ptOpts:PointLogOptions = POINT_LOG_DEFAULTS):DocumentData{
    let data = {
        "DateOccurred":date_occurred,
        "DateSubmitted":(ptOpts.date_submitted !== undefined)?ptOpts.date_submitted:POINT_LOG_DEFAULTS.date_submitted,
        "Description":(ptOpts.date_submitted !== undefined)?ptOpts.description:POINT_LOG_DEFAULTS.date_submitted,
        "FloorID":(ptOpts.floor_id !== undefined)?ptOpts.floor_id:POINT_LOG_DEFAULTS.floor_id,
        "PointTypeID":(ptOpts.point_type_id !== undefined)?ptOpts.point_type_id:POINT_LOG_DEFAULTS.point_type_id! * -1,
        "RHPNotifications":(ptOpts.rhp_notifications !== undefined)?ptOpts.rhp_notifications:POINT_LOG_DEFAULTS.rhp_notifications,
        "ResidentFirstName":(ptOpts.resident_first_name !== undefined)?ptOpts.resident_first_name:POINT_LOG_DEFAULTS.resident_first_name,
        "ResidentId":resident_id,
        "ResidentLastName":(ptOpts.resident_last_name !== undefined)?ptOpts.resident_last_name:POINT_LOG_DEFAULTS.resident_last_name,
        "ResidentNotifications":(ptOpts.resident_notifications !== undefined)?ptOpts.resident_notifications:POINT_LOG_DEFAULTS.resident_notifications
    }
    if(approved){
        data["ApprovedBy"] = (ptOpts.approved_by !== undefined)?ptOpts.approved_by:POINT_LOG_DEFAULTS.approved_by
        data["ApprovedOn"] = (ptOpts.approved_on !== undefined)?ptOpts.approved_on:POINT_LOG_DEFAULTS.approved_on
        data["PointTypeID"] = data["PointTypeID"] * -1
    }
    return {
        id: log_id,
        data: data
    }
}

/**
 * Type declaration for fields to add to a point log. Undefined fields will be defaulted.
 */
export declare type PointLogOptions = {
    id?:string,
    approved_by?:string,
    approved_on?:Date,
    date_occurred?:Date,
    date_submitted?:Date,
    description?:string,
    floor_id?:string,
    point_type_id?:number,
    rhp_notifications?:number,
    resident_first_name?:string,
    resident_last_name?:string,
    resident_notifications?:number

}

/**
 * Default fields for point log
 */
export const POINT_LOG_DEFAULTS:PointLogOptions = {
    approved_by: "Preapproved",
    approved_on: new Date(Date.parse("5/18/2020")),
    date_occurred: new Date(Date.parse("5/18/2020")),
    date_submitted: new Date(Date.parse("5/18/2020")),
    description: "Empty Description",
    floor_id: "4N",
    point_type_id: 1,
    rhp_notifications: 0,
    resident_first_name: "TEST_FIRST",
    resident_last_name: "TEST_LAST",
    resident_notifications: 0

}