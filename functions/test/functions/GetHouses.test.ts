import * as MockDataFactory from '../MockDataFactory'

const GetHouses = require('../../src/src/GetHouses')


//Sample Firestore databse object
const Copper: MockDataFactory.DocumentData = {
    id: "Copper",
    data: {
        Color:"#F8971C",
        NumberOfResidents: 178,
        TotalPoints:1780,
        ppr: 10 // not it database but for testing
    }
}

//Sample Firestore databse object
const Platinum: MockDataFactory.DocumentData = {
    id: "Platinum",
    data: {
        Color:"#5AC0C7",
        NumberOfResidents: 200,
        TotalPoints:8000,
        ppr: 40 // not in database but for testing
    }
}

//Sample Firestore databse object
const Palladium: MockDataFactory.DocumentData = {
    id: "Palladium",
    data: {
        Color:"#A7AAAB",
        NumberOfResidents: 200,
        TotalPoints:4000,
        ppr: 20 // not in databse but for testing
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
                    doc: (doc_id: String)=> {
                        if(doc_id === Platinum.id){
                            return {
                                get: MockDataFactory.mockFirebaseDocumentRequest(Platinum)
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
                    },
                    get: MockDataFactory.mockFirebaseQueryRequest([
                        Platinum,
                        Palladium,
                        Copper
                        ])
                }
            }
            else{
                throw Error("Unkown Collection")
            }
            
        }
    })
}))

//Test Suite GetHouse
describe('GetHouseByName', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('Test House By Name Success', async() => {
        let result = await GetHouses.getHouseByName(Platinum.id);

        /*color: string
    numberOfResidents: number
    totalPoints: number
    id:string
    pointsPerResident: number
        */

        //Keys need to match the keys listed in the api documentation
        expect(result.color).toBe(Platinum.data.Color)
        expect(result.id).toBe(Platinum.id)
        expect(result.numberOfResidents).toBe(Platinum.data.NumberOfResidents)
        expect(result.pointsPerResident).toBe(Platinum.data.ppr)

    })


    //Test that a non existant document is correctly handled
    it('Test DocumentDoesntExist', async() => {
        const id =  "";
        try{
            await GetHouses.getHouseByName(id);
            fail()
        }
        catch (err){
            expect(err.code).toBe(425)
        }
        
    })
})

describe('getAllHouses', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('Test Get All Houses Success', async() => {
        let rewards = await GetHouses.getAllHouses();
        //Keys need to match the keys listed in the api documentation
        expect(rewards).toHaveLength(3)
        //Yes. I am biased. Platinum must always be in first place. I am declaring this as a coding standard for this repository.
        expect(rewards[0].id).toBe(Platinum.id)
        expect(rewards[1].id).toBe(Palladium.id)
        expect(rewards[2].id).toBe(Copper.id)
    })
})