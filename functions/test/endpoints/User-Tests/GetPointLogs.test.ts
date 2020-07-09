import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let user_func
const RESIDENT_ID = "RESIDENT_GET_POINT_LOGS"
const RHP_ID = "RHP_GET_POINT_LOGS"
const PROF_ID = "Proffesional Staff_GET_POINT_LOGS"
const FHP_ID = "FHP_GET_POINT_LOGS"
const PRIV_RES = "PRIV_RES_GET_POINT_LOGS"
const EA = "External Advisor_GET_POINT_LOGS"
let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('user/get', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        user_func = require('../../../src/endpoint_paths/index.ts').user

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA, 5)

        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,true)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,true)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,true)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RESIDENT_ID,false)
        await FirestoreDataFactory.setPointLog(db,"Platinum",RHP_ID,true)
        await FirestoreDataFactory.setPointLog(db,"Platinum",PRIV_RES,true)

    })

    //Test residet gets 2 points logs
    it('Get Resident with limit 5', (done) => {
        const res = factory.get(user_func, "/points?limit=5", RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.points).toHaveLength(5)
                done()
            }
        })
    })

    //Test rhp get logs
    it('Get RHP', (done) => {
        const res = factory.get(user_func, "/points", RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.points).toHaveLength(1)
                done()
            }
        })
    })

    //Test prof staff throws 403
    it('Get Prof Staff', (done) =>{
        const res = factory.get(user_func, "/points", PROF_ID)
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

    //Test fhp throws 403
    it('Get FHP', (done) =>{
        const res = factory.get(user_func, "/points", FHP_ID)
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

    //Test that it priv res gets points
    it('Get Priv Res', (done) =>{
        const res = factory.get(user_func, "/points", PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.points).toHaveLength(1)
                done()
            }
        })
    })

    //Test that EA throws 403
    it('Get EA', (done) =>{
        const res = factory.get(user_func, "/points", EA)
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

    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(()=>{
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


