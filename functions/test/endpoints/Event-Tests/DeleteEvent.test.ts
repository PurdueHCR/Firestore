import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let event_function
const RHP_ID = "RHP"
const EA_ID = "EA"

const ENDPOINT = '/'
const EVENT_ID_TO_DELETE = "EVENT_ID_TO_DELETE"
const NON_DELETED_EVENT_ID = "NON_DELETED_EVENT_ID"

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('DELETE Event/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        event_function = require('../../../src/endpoint_paths/index.ts').event

        await FirestoreDataFactory.setAllHouses(db)

        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)


        await FirestoreDataFactory.setEvent(db, EVENT_ID_TO_DELETE, RHP_ID)
        await FirestoreDataFactory.setEvent(db, NON_DELETED_EVENT_ID, RHP_ID)

    })

    it('Test call endpoint without parameter', async (done) => {
        const res = factory.deleteCommand(event_function, ENDPOINT, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                //404 because it wont match the pattern of /event/{evnetId}
                expect(res.status).toBe(404)
                done()
            } 
        })
    })


    it('Test RHP Deletes their event', async (done) => {
        const originalCount = (await db.collection("Events").get()).docs.length
        const res = factory.deleteCommand(event_function, ENDPOINT+`${EVENT_ID_TO_DELETE}`, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const newCount = (await db.collection("Events").get()).docs.length
                expect(newCount).toBe(originalCount-1)
                done()
            } 
        })
    })

    it('Test RHP attempts to delete an event that doesn\'t exist', async (done) => {
        const originalCount = (await db.collection("Events").get()).docs.length
        const res = factory.deleteCommand(event_function, ENDPOINT+'Fake_ID', RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(450)
                const newCount = (await db.collection("Events").get()).docs.length
                expect(newCount).toBe(originalCount)
                done()
            }
        })
    })

    it('Test External advisor attempts to delete an event they didn\'t create', async (done) => {
        const originalCount = (await db.collection("Events").get()).docs.length
        const res = factory.deleteCommand(event_function, ENDPOINT+`${NON_DELETED_EVENT_ID}`, EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(432)
                const newCount = (await db.collection("Events").get()).docs.length
                expect(newCount).toBe(originalCount)
                done()
            } 
        })
    })


    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


