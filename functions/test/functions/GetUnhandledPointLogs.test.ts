import * as MockDataFactory from '../MockDataFactory'
import * as ModelFactory from './tools/ModelFactory'

const GetUnhandledLogs = require('../../src/src/GetUnhandledLogs')


//Sample Firestore databse object
const log_1 = MockDataFactory.mockPointLog("A","LOG_1", new Date(Date.parse("5/18/2020")))
const log_2 = MockDataFactory.mockPointLog("A","LOG_2", new Date(Date.parse("5/17/2020")))
const log_3 = MockDataFactory.mockPointLog("A","LOG_3", new Date(Date.parse("5/16/2020")))
const log_4 = MockDataFactory.mockPointLog("A","LOG_4", new Date(Date.parse("5/15/2020")))
const log_5 = MockDataFactory.mockPointLog("A","LOG_5", new Date(Date.parse("5/14/2020")))


const rhp = ModelFactory.createUser("Test-rhp-ID", 1, {first:"First name", floor_id:"2N", house_name:"Copper", last:"Last Name", semester_points: 20, total_points:20})

const platinumrhp = ModelFactory.createUser("Test-platinumrhp-ID", 1, {first:"First name", floor_id:"4N", house_name:"Platinum", last:"Last Name", semester_points: 20, total_points:20})


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
        let logs = await GetUnhandledLogs.getUnhandledPointLogs(rhp);
        expect(logs).toHaveLength(0)
    })

    //
    test('Unhandled Points point logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs(platinumrhp);
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })

    //
    test('User limit less than number of logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs(platinumrhp, 3);
        expect(logs).toHaveLength(3)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
    })

    //
    test(' limits more than point logs', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs(platinumrhp, 8);
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })

    //
    test('invalid limit', async() => {
        let logs = await GetUnhandledLogs.getUnhandledPointLogs(platinumrhp, -10);
        expect(logs).toHaveLength(5)
        expect(logs[0].dateOccurred.getDay()).toBe(new Date(Date.parse("5/18/2020")).getDay())
        expect(logs[1].dateOccurred.getDay()).toBe(new Date(Date.parse("5/17/2020")).getDay())
        expect(logs[2].dateOccurred.getDay()).toBe(new Date(Date.parse("5/16/2020")).getDay())
        expect(logs[3].dateOccurred.getDay()).toBe(new Date(Date.parse("5/15/2020")).getDay())
        expect(logs[4].dateOccurred.getDay()).toBe(new Date(Date.parse("5/14/2020")).getDay())
    })




})
