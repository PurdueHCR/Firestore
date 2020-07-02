import * as MockDataFactory from '../MockDataFactory'

const AddPoints = require('../../src/src/AddPoints')

var house_points = 0
var user_points = 0

// WARNING: THIS WAS NEVER FULLY IMPLEMENTED AND IS NOT CORRECT

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
                            fields: {
                                "4N:Code":"4N123",
                                "4S:Code":"4S123",
                                "Color":"#5AC0C7",
                                "Number of Residents":"200",
                                "TotalPoints":1
                            },
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
                                                    get:MockDataFactory.mockFirebaseQueryRequest([])
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

// Test Suite AddPoints
describe('Test Add Point Logs', () => {

    // Test add points to user and house
    test('Add points to user and house', async() => {
        const old_house_points = house_points
        const old_user_points = user_points
        let err = await AddPoints.addPoints(1, "Platinum", "A")
        expect(err).toBe(null)
        expect(user_points).toBe(old_house_points + 1)
        expect(house_points).toBe(old_user_points + 1)
    })

    // Test only add points to house

    // Test add negative points



})