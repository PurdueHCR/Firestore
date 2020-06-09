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