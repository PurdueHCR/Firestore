import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let pt_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const PRIV_RES = "PRIV_RES"
const PROF_ID = "Proffesional Staff"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('point_types/linkable', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        pt_func = require('../../../src/endpoint_paths/index.ts').point_type

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)

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


        await FirestoreDataFactory.setSystemPreference(db)
    })

    //Test Competition Disabled
    it('Competition Disabled', async (done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})
        const res = factory.get(pt_func, "/linkable", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(0)
                done()
            }
        })
    })

    //Test non professional staff
    it('Test resident', (done) => {
        const res = factory.get(pt_func, "/linkable", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(0)
                done()
            }
        })
    })

    //Test professional staff
    it('Test Professional Staff', (done) => {
        const res = factory.get(pt_func, "/linkable", PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types).toHaveLength(6)
                expect(res.body.point_types[0].id).toBe("0")
                expect(res.body.point_types[1].id).toBe("1")
                expect(res.body.point_types[2].id).toBe("2")
                expect(res.body.point_types[3].id).toBe("6")
                expect(res.body.point_types[4].id).toBe("7")
                expect(res.body.point_types[5].id).toBe("8")
                done()
            }
        })
    })

    //Test professional staff
    it('Test Privileged resident', (done) => {
        const res = factory.get(pt_func, "/linkable", PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types[0].id).toBe("2")
                done()
            }
        })
    }) 


    //Test Competition Hidden
    it('Competition Hidden and RHP', (done) => {
        const res = factory.get(pt_func, "/linkable", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_types[0].id).toBe("1")
                expect(res.body.point_types[1].id).toBe("2")
                expect(res.body.point_types[2].id).toBe("7")
                expect(res.body.point_types[3].id).toBe("8")
                done()
            }
        })
    })

    afterEach(async ()=> {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
    })

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


