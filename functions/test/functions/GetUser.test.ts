import * as MockDataFactory from '../MockDataFactory'

//Require the function that you will test
const GetUser = require('../../src/src/GetUser')

//Sample data object to return
const user:{} = {
    FirstName: "First name",
    FloorID: "4N",
    House: "Platinum",
    lastName: "Last Name",
    LastSemesterPoints: 20,
    "Permission Level": 0,
    TotalPoints: 20,
    UserID: "Test-User-ID"
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
        collection: (collection_name: String) => ({

            //db.collection(*).doc(*)
            //This will mock for any string passed into collection
            //but is sufficient becasue GetUser only uses the collection 'Users'
            doc: (doc_id: String)=> {
                if(doc_id === "Test-User-ID"){
                    return {
                        //db.collection("").doc("Test-User-ID").get()
                        get: MockDataFactory.mockFirebaseDocumentRequest("Test-User-ID", user)
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
        })
    })
}))

//Test Suite GetUser
describe('GetUser', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('TestGetUserSuccess', async() => {
        const id =  "Test-User-ID";
        let result = await GetUser.getUser(id);
        expect(result.firstName).toBe("First name")
    })

    //Test that a server error is correctly handled
    test('TestServerError', async() => {
        const id =  "Server-Error";
        try{
            await GetUser.getUser(id);
            fail()
        }
        catch(err){
            expect(err.code).toBe(500)
        }
        
    })

    //Test that a non existant document is correctly handled
    it('TestDocumentDoesntExist', async() => {
        const id =  "";
        try{
            await GetUser.getUser(id);
            fail()
        }
        catch (err){
            expect(err.code).toBe(400)
        }
        
    })
})