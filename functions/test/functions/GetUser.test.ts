import * as MockDataFactory from '../MockDataFactory'

//Require the function that you will test
const GetUser = require('../../src/src/GetUser')

//Sample data object to return
const user:MockDataFactory.DocumentData = {
    id: "Test-User-ID",
    data: {
        FirstName: "First name",
        FloorID: "4N",
        House: "Platinum",
        LastName: "Last Name",
        SemesterPoints: 20,
        "Permission Level": 0,
        TotalPoints: 20,
        UserID: "Test-User-ID"
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
        collection: (collection_name: String) => ({

            //db.collection(*).doc(*)
            //This will mock for any string passed into collection
            //but is sufficient becasue GetUser only uses the collection 'Users'
            doc: (doc_id: String)=> {
                if(doc_id === "Test-User-ID"){
                    return {
                        //db.collection("").doc("Test-User-ID").get()
                        get: MockDataFactory.mockFirebaseDocumentRequest(user)
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
        let result = await GetUser.getUser(user.id);
        expect(result.id).toBe(user.id)
        expect(result.firstName).toBe(user.data.FirstName)
        expect(result.lastName).toBe(user.data.LastName)
        expect(result.floorId).toBe(user.data.FloorID)
        expect(result.house).toBe(user.data.House)
        expect(result.semesterPoints).toBe(user.data.SemesterPoints)
        expect(result.totalPoints).toBe(user.data.TotalPoints)
        expect(result.permissionLevel).toBe(user.data["Permission Level"])

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
