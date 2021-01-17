import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let event_function
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const EA_ID = "PROFFESSIONAL_STAFF"

const ENDPOINT = '/'


let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('DELETE Event/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        event_function = require('../../../src/endpoint_paths/index.ts').event

        await FirestoreDataFactory.setAllHouses(db)
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)


        await FirestoreDataFactory.setEvent(db, 'EVENT 1', RHP_ID)
        await FirestoreDataFactory.setEvent(db, 'EVENT 2', RHP_ID)
        await FirestoreDataFactory.setEvent(db, 'EVENT 3', RHP_ID)

    })

    it('Invalid permission error when residents call endpoint', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            } 
        })
    })


    it('Test Get events where user has list of events', async (done) => {
        const res = factory.get(event_function, ENDPOINT, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test get events when user has no events', async (done) => {
        const res = factory.get(event_function, ENDPOINT, EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.events).toHaveLength(0)
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


