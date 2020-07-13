import * as MockDataFactory from '../MockDataFactory'

const GetSubmittablePointTypes = require('../../src/src/GetSubmittablePointTypes')
const UserModel = require('../../src/models/User')

const resident = new UserModel.User("First","4N","Platinum","Last",0,0,0,"res")
const rhp = new UserModel.User("First","4N","Platinum","Last",0,1,0,"rhp")
const prof_staff = new UserModel.User("First","","","Last",0,2,0,"prof_staff")
const fhp = new UserModel.User("First","","","Last",0,3,0,"fhp")
const priv_res = new UserModel.User("First","","","Last",0,4,0,"priv_res")
const ea = new UserModel.User("First","","","Last",0,5,0,"ea")
//Name scheme:
// en - enabled; ne - not enabled
// cs - residents can submit; ns residents can not submit
// lp - Link Professional (1), lr - link residential (2), la - Link creatable all (3)

const en_cs_lp = MockDataFactory.mockPointType(1,"PT 1", true, "PT 1", 1,true,1)
const en_cs_lr = MockDataFactory.mockPointType(2,"PT 2", true, "PT 2", 2,true,1)
const en_cs_la = MockDataFactory.mockPointType(3,"PT 3", true, "PT 3", 3,true,1)
const en_ns_lp = MockDataFactory.mockPointType(4,"PT 4", true, "PT 4", 1,false,1)
const en_ns_lr = MockDataFactory.mockPointType(5,"PT 5", true, "PT 5", 2,false,1)
const en_ns_la = MockDataFactory.mockPointType(6,"PT 6", true, "PT 6", 3,false,1)
const ne_cs_lp = MockDataFactory.mockPointType(7,"PT 7", false, "PT 7", 1,true,1)
const ne_cs_lr = MockDataFactory.mockPointType(8,"PT 8", false, "PT 8", 2,true,1)
const ne_cs_la = MockDataFactory.mockPointType(9,"PT 9", false, "PT 9", 3,true,1)
const ne_ns_lp = MockDataFactory.mockPointType(10,"PT 10", false, "PT 10", 1,false,1)
const ne_ns_lr = MockDataFactory.mockPointType(11,"PT 11", false, "PT 11", 2,false,1)
const ne_ns_la = MockDataFactory.mockPointType(12,"PT 12", false, "PT 12", 3,false,1)

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
            if(collection_name === "PointTypes"){
                return {
                    get: MockDataFactory.mockFirebaseQueryRequest([
                        en_cs_lp,
                        en_cs_lr,
                        en_cs_la,
                        en_ns_lp,
                        en_ns_lr,
                        en_ns_la,
                        ne_cs_lp,
                        ne_cs_lr,
                        ne_cs_la,
                        ne_ns_lp,
                        ne_ns_lr,
                        ne_ns_la
                        ]
                    )
                }
            }
            else{
                throw Error("Unkown Collection")
            }
            
        }
    })
}))

//Test Suite GetHouse
describe('Get Submittable Point Types', () =>{
    //Test Get Resident Point Types
    test('Test Resident Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(resident)
        //
        expect(pointTypes[0].id).toBe(en_cs_lp.id)
        expect(pointTypes[1].id).toBe(en_cs_lr.id)
        expect(pointTypes[2].id).toBe(en_cs_la.id)
    })
    test('Test RHP Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(rhp)
        //
        expect(pointTypes[0].id).toBe(en_cs_lp.id)
        expect(pointTypes[1].id).toBe(en_cs_lr.id)
        expect(pointTypes[2].id).toBe(en_cs_la.id)
    })

    test('Test Professional Staff Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(prof_staff
            )
        expect(pointTypes).toHaveLength(0)
    })

    test('Test fhp Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(fhp)
        expect(pointTypes).toHaveLength(0)
    })

    test('Test priv_res Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(priv_res)
        //
        expect(pointTypes[0].id).toBe(en_cs_lp.id)
        expect(pointTypes[1].id).toBe(en_cs_lr.id)
        expect(pointTypes[2].id).toBe(en_cs_la.id)
    })

    test('Test External Advisor Submittable', async() => {
        const pointTypes = await GetSubmittablePointTypes.getSubmittablePointTypes(ea)
        expect(pointTypes).toHaveLength(0)
    })
})