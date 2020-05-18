import * as MockDataFactory from '../MockDataFactory'

//Require the function that you will test
const GetUserRank = require('../../src/src/GetUserRank')

//Sample data object to return
const personA = createUser("A","Copper",20,20)
const personB = createUser("B","Platinum",20,20)
const personC = createUser("C","Platinum",20,20)
const personD = createUser("D","Platinum",10,10)
const personE = createUser("E","Palladium",30,30)
const personF = createUser("F","Palladium",20,20)
const personG = createUser("G","Palladium",10,10)
const personH = createUser("H","Titanium",40,40)
const personI = createUser("I","Titanium",20,20)
const personJ = createUser("J","Titanium",20,20)
const personK = createUser("K","Titanium",10,10)
const REC = createUser("REC","Titanium",10,10, 2)
const Privileged = createUser("Privileged","Titanium",10,10, 4)

let userById = new Map<String, MockDataFactory.DocumentData>()

userById.set("A",personA)
userById.set("B",personB)
userById.set("C",personC)
userById.set("D",personD)
userById.set("E",personE)
userById.set("F",personF)
userById.set("G",personG)
userById.set("H",personH)
userById.set("I",personI)
userById.set("J",personJ)
userById.set("K",personK)
userById.set("REC",REC)
userById.set("Privileged",Privileged)


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
                if(userById.has(doc_id)){
                    return {
                        //db.collection("").doc("Test-User-ID").get()
                        get: MockDataFactory.mockFirebaseDocumentRequest(userById.get(doc_id)!)
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
            where: (field:string, comparator:string,value:string)=>{
                if(value === "Copper")
                    return { get:MockDataFactory.mockFirebaseQueryRequest([personA])}
                else if(value == "Palladium")
                    return { get:MockDataFactory.mockFirebaseQueryRequest([personF, personE, personG])}
                else if(value == "Platinum")
                    return { get:MockDataFactory.mockFirebaseQueryRequest([personD, personC, personB])}
                else if(value == "Titanium")
                    return { get:MockDataFactory.mockFirebaseQueryRequest([personK, REC, Privileged, personJ, personH, personI])}
                else {
                    return { get:MockDataFactory.mockDocumentDoesntExist()}
                }
            }
        })
    })
}))

//Test Suite Get User Rank
describe('Get User Rank', () =>{

    //Test that a server error is correctly handled
    test('TestServerError', async() => {
        const id =  "Server-Error";
        try{
            await GetUserRank.getUserRank(id);
            fail()
        }
        catch(err){
            expect(err.code).toBe(500)
        }
        
    })

    //Test that a non existant document is correctly handled
    it('Test User Doesnt Exist', async() => {
        const id =  "";
        try{
            await GetUserRank.getUserRank(id);
            fail()
        }
        catch (err){
            expect(err.code).toBe(400)
        }
        
    })

    it('Invalid Permission Level', async() => {
        try{
            await GetUserRank.getUserRank(REC.id)
            fail()
        }
        catch(err){
            expect(err.code).toBe(403)
        }
    })


    it('User First Place', async() =>{
        //Copper only 1 person
        console.log(JSON.stringify(personA))
        const result = await GetUserRank.getUserRank(personA.id)
        expect(result.houseRank).toBe(1)
        expect(result.semesterRank).toBe(1)
    })

    it('User Last Place', async() =>{
        //Platinum and tie first (3 people)
        const result = await GetUserRank.getUserRank(personD.id)
        expect(result.houseRank).toBe(3)
        expect(result.semesterRank).toBe(3)
    })

    it('User Middle Place', async() =>{
        //Palladium 3 people
        const result = await GetUserRank.getUserRank(personF.id)
        expect(result.houseRank).toBe(2)
        expect(result.semesterRank).toBe(2)
    })

    it('User Tie First Place', async() =>{
        //Platinum first 2 people
        let result = await GetUserRank.getUserRank(personB.id)
        expect(result.houseRank).toBe(1)
        expect(result.semesterRank).toBe(1)

        result = await GetUserRank.getUserRank(personC.id)
        expect(result.houseRank).toBe(1)
        expect(result.semesterRank).toBe(1)
    })

    it('User Tie Last Place and Privileged User', async() =>{
        //titanium last 2
        let result = await GetUserRank.getUserRank(personK.id)
        expect(result.houseRank).toBe(4)
        expect(result.semesterRank).toBe(4)

        result = await GetUserRank.getUserRank(Privileged.id)
        expect(result.houseRank).toBe(4)
        expect(result.semesterRank).toBe(4)
    })

    it('User Tie Middle Place', async() =>{
        let result = await GetUserRank.getUserRank(personI.id)
        expect(result.houseRank).toBe(2)
        expect(result.semesterRank).toBe(2)

        result = await GetUserRank.getUserRank(personJ.id)
        expect(result.houseRank).toBe(2)
        expect(result.semesterRank).toBe(2)
    })
})


function createUser(id: String, house: String, points:number, semesterPoints:number, permission:number = 0) : MockDataFactory.DocumentData{
    return {
        id: id,
        data: {
            FirstName: "Person "+id,
            FloorID: "4N",
            House: house,
            lastName: "LAST",
            SemesterPoints: semesterPoints,
            "Permission Level": permission,
            TotalPoints: points,
            UserID: id
        }
    }
}
