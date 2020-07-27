import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let pt_func
const RESIDENT_ID = "RESIDENT"
const PROF_ID = "Proffesional Staff"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('point_type/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        pt_func = require('../../../src/endpoint_paths/index.ts').point_type

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)

        await FirestoreDataFactory.setPointType(db, 0, {residents_can_submit: true, is_enabled: true, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 1, {residents_can_submit: true, is_enabled: true, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 2, {residents_can_submit: true, is_enabled: true, permission_level: 3})
        await FirestoreDataFactory.setPointType(db, 3, {residents_can_submit: true, is_enabled: false, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 4, {residents_can_submit: true, is_enabled: false, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 5, {residents_can_submit: true, is_enabled: false, permission_level: 3})
        await FirestoreDataFactory.setPointType(db, 6, {residents_can_submit: false, is_enabled: true, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 7, {residents_can_submit: false, is_enabled: true, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 8, {residents_can_submit: false, is_enabled: true, permission_level: 3})
        await FirestoreDataFactory.setPointType(db, 9, {residents_can_submit: false, is_enabled: false, permission_level: 1})
        await FirestoreDataFactory.setPointType(db, 10, {residents_can_submit: false, is_enabled: false, permission_level: 2})
        await FirestoreDataFactory.setPointType(db, 11, {residents_can_submit: false, is_enabled: false, permission_level: 3})


    })

    //Test Competition Disabled
    it('Competition Disabled', (done) => {
        const res = factory.get(pt_func, "/", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(12)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test Non professional Staff', (done) => {
        const res = factory.get(pt_func, "/", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    //Test Competition Disabled
    it('Test Professional Staff', (done) => {
        const res = factory.get(pt_func, "/", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(12)
                done()
            }
        })
    })


    //Test Competition Hidden
    it('Competition Hidden', (done) => {
        const res = factory.get(pt_func, "/", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(12)
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


