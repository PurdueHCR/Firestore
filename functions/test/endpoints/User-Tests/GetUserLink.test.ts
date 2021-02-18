import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const PROF_ID = "Proffesional Staff"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('GET user/links', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user

        await FirestoreDataFactory.setAllHouses(db)

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)

        await FirestoreDataFactory.setPointType(db, 0, {residents_can_submit: true, is_enabled: true, permission_level: 3})
        await FirestoreDataFactory.setPointType(db, 1, {residents_can_submit: true, is_enabled: true, permission_level: 3})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: true, is_enabled: true, permission_level: 3})

        await FirestoreDataFactory.setLink(db, "Link 1", PROF_ID, 1)
        await FirestoreDataFactory.setLink(db, "Link 2", PROF_ID, 2)
        await FirestoreDataFactory.setLink(db, "Link 3", PROF_ID, 1)



    })

    //Test get links
    it('Get Links Success', (done) => {
        const res = factory.get(user_func, "/links", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.links).toHaveLength(3)
                done()
            }
        })
    })

    //Test get links
    it('Get no links', (done) => {
        const res = factory.get(user_func, "/links", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.links).toHaveLength(0)
                done()
            }
        })
    })

    //Test Resident
    it('Get resident', (done) => {
        const res = factory.get(user_func, "/links", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.links).toHaveLength(0)
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
