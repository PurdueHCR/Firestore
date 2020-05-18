import * as MockDataFactory from '../MockDataFactory'
import * as House from '../../src/models/House'
//Require the function that you will test
const GetReward = require('../../src/src/GetReward')

//Sample Firestore databse object
const highReward: MockDataFactory.DocumentData = {
    id: "House Shirt",
    data: {
        FileName: "HouseShirt.png",
        RequiredPPR: 30,
        RequiredValue: 30000
    }
}

const middleReward: MockDataFactory.DocumentData = {
    id: "Pizza Party",
    data: {
        FileName: "Pizza.png",
        RequiredPPR: 20,
        RequiredValue: 2000
    }
}

const lowReward: MockDataFactory.DocumentData = {
    id: "Ice Cream Party",
    data: {
        FileName: "IceCream.png",
        RequiredPPR: 10,
        RequiredValue: 1000
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
            if(collection_name === "Rewards"){
                return {
                    doc: (doc_id: String)=> {
                        if(doc_id === highReward.id){
                            return {
                                get: MockDataFactory.mockFirebaseDocumentRequest(highReward)
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
                    orderBy: (fieldPath: string , directionStr?: "desc" | "asc" | undefined) => {
                        return {
                            get: MockDataFactory.mockFirebaseQueryRequest([
                                lowReward,
                                middleReward,
                                highReward
                            ])
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



//Test Suite GetReward
describe('GetRewardById', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('TestGetRewardByIdSuccess', async() => {
        let result = await GetReward.getRewardById(highReward.id);
        //Keys need to match the keys listed in the api documentation
        expect(result.fileName).toBe(highReward.data.FileName)
        expect(result.id).toBe(highReward.id)
        expect(result.requiredPPR).toBe(highReward.data.RequiredPPR)
        expect(result.requiredValue).toBe(highReward.data.RequiredValue)

    })

    //Test that a server error is correctly handled
    test('TestServerError', async() => {
        const id =  "Server-Error";
        try{
            await GetReward.getRewardById(id);
            fail()
        }
        catch(err){
            expect(err.code).toBe(500)
        }
        
    })

    //Test that a non existant document is correctly handled
    it('Test DocumentDoesntExist', async() => {
        const id =  "";
        try{
            await GetReward.getRewardById(id);
            fail()
        }
        catch (err){
            expect(err.code).toBe(420)
        }
        
    })
})

describe('getAllRewards', () =>{

    //Test GetUserSuccess. Ensure a user is correctly returned
    test('Test getAllRewardsSuccess', async() => {
        let rewards = await GetReward.getAllRewards();
        //Keys need to match the keys listed in the api documentation
        expect(rewards).toHaveLength(3)
    })
})

describe('Get Next Reward for House', () => {

    test('Test Get First Reward', async() => {
        let house = new House.House("#000000", 100, 0, "Copper")
        let result = await GetReward.getNextRewardForHouse(house)
        expect(result.fileName).toBe(lowReward.data.FileName)
        expect(result.id).toBe(lowReward.id)
        expect(result.requiredPPR).toBe(lowReward.data.RequiredPPR)
        expect(result.requiredValue).toBe(lowReward.data.RequiredValue)
    })

    test('Test Get Middle Reward', async() => {
        const ppr: number = middleReward.data.RequiredPPR * 100 - 10
        let house = new House.House("#000000", 100, ppr, "Copper")
        let result = await GetReward.getNextRewardForHouse(house)
        expect(result.fileName).toBe(middleReward.data.FileName)
        expect(result.id).toBe(middleReward.id)
        expect(result.requiredPPR).toBe(middleReward.data.RequiredPPR)
        expect(result.requiredValue).toBe(middleReward.data.RequiredValue)
    })

    test('Test Surpass all rewards', async() => {
        const ppr:number = highReward.data.RequiredPPR * 200
        let house = new House.House("#000000", 100, ppr, "Copper")
        let result = await GetReward.getNextRewardForHouse(house)
        expect(result.fileName).toBe(highReward.data.FileName)
        expect(result.id).toBe(highReward.id)
        expect(result.requiredPPR).toBe(highReward.data.RequiredPPR)
        expect(result.requiredValue).toBe(highReward.data.RequiredValue)
    })
})