/**
 * Mock function that returns a Promise that resolves a 
 * FirebaseDocument with the provided data and id
 * 
 * @param id Id for the mocked document
 * @param data {} for the mocked object.
 */
export function mockFirebaseDocumentRequest(id:String, data:{}): Function {
    const mockDocumentRequest = jest.fn()
    mockDocumentRequest.mockResolvedValue(Promise.resolve({
        exists: true,
        id: id,
        data: () => (data)
    }))
    return mockDocumentRequest
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