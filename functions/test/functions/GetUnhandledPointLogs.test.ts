import * as MockDataFactory from '../MockDataFactory'

const GetUnhandledLogs = require('../../src/src/GetUnhandledLogs')


//Sample Firestore databse object
const log_1 = MockDataFactory.mockPointLog("A","LOG_1", new Date(Date.parse("5/18/2020")))
const log_2 = MockDataFactory.mockPointLog("A","LOG_2", new Date(Date.parse("5/17/2020")))
const log_3 = MockDataFactory.mockPointLog("A","LOG_3", new Date(Date.parse("5/16/2020")))
const log_4 = MockDataFactory.mockPointLog("A","LOG_4", new Date(Date.parse("5/15/2020")))
const log_5 = MockDataFactory.mockPointLog("A","LOG_5", new Date(Date.parse("5/14/2020")))

const rhp:MockDataFactory.DocumentData = {
    id: "Test-rhp-ID",
    data: {
        FirstName: "First name",
        FloorID: "4N",
        House: "Copper",
        LastName: "Last Name",
        SemesterPoints: 20,
        "Permission Level": 1,
        TotalPoints: 20,
        UserID: "Test-rhp-ID"
    }
}

const platinumrhp:MockDataFactory.DocumentData = {
    id: "platinumrhp",
    data: {
        FirstName: "First name",
        FloorID: "4N",
        House: "Platinum",
        LastName: "Last Name",
        SemesterPoints: 20,
        "Permission Level": 1,
        TotalPoints: 20,
        UserID: "platinumrhp"
    }
}



//Mock the dependency firebase-admin
//This example mocks the following
//admin.initializeApp()
//admin.firestore()
//db.collection(string).doc(string).get()
jest.mock('firebase-admin', () => ({

    apps: {
        length: 0
    },

    auth: () => {},

    //This mocks admin.initializeApp() so whenever the app calls initializeApp(),
    //it will run jest.fn() which is an empty function
    initializeApp: () => {
        jest.fn()
    },

    //Mocks admin.firestore() Which is often saved as db
    firestore: () => ({
        //db.collection("")
        collection: (collection_name: String) => {
            if(collection_name === "House"){
                return {
                    doc: (doc_name: String) => {
                        return {
                            collection: (sub_collection_name: String) =>{
                                if(sub_collection_name == "Points"){
                                    return {
                                        where: (field:String, comparator:String, value:String) => {
                                            if(doc_name == "Copper"){
                                                return {
                                                    get:MockDataFactory.mockFirebaseQueryRequest([])
                                                }
                                            }
                                            else {
                                                return {
                                                    get:MockDataFactory.mockFirebaseQueryRequest([log_3,log_5,log_1,log_2,log_4])
                                                }
                                            }
                                        }
                                    }
                                }
                                else{
                                    throw Error("Unknown Sub Collection")
                                }
                            }
                        }
                    }
                }
            }
            else if(collection_name === "Users"){
                return {
                    doc: (doc_id: String)=> {
                        if(doc_id === "Test-rhp-ID"){
                            return {
                                //db.collection("").doc("Test-User-ID").get()
                                get: MockDataFactory.mockFirebaseDocumentRequest(rhp)
                            }
                        }
                        else if(doc_id === "platinumrhp"){
                            return {
                                get: MockDataFactory.mockFirebaseDocumentRequest(platinumrhp)
                            }
                        }
                        else if(doc_id === "Server-Error"){
                            return {
                                //db.collection("").doc("Server-Error").get()
                                get: MockDataFactory.mockServerError()
                            }
                        }
                        else {
                            return {
                                //db.collection(*).doc(*).get()
                                get:MockDataFactory.mockDocumentDoesntExist()
                            }
                        }
                    }
                }
            }
            else{
                throw Error("Unkown Collection")
            }
            
        }
    })
}))

//Test Suite GetHouse
describe('Test Get unhandled Point logs', () =>{

    //
    test('No unhandled point logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs("Test-rhp-ID");
        expect(logs).toHaveLength(0)
    })

    //
    test('Unhandled Points point logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs("platinumrhp");
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })

    //
    test('User limit less than number of logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs("platinumrhp", 3);
        expect(logs).toHaveLength(3)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
    })

    //
    test(' limits more than point logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs("platinumrhp", 8);
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })

    //
    test('invalid limit', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs("platinumrhp", -10);
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })




})
