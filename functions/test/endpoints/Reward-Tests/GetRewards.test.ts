import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let rewards_func
const RESIDENT_ID = "RESIDENT"
const RHP_ID = "RHP"
const PROF_ID = "Proffesional_Staff"
const FACULTY = "FACULTY"
const PRIV_RES = "PRIV_RES"
const EA_ID = "EA"

const ENDPOINT = '/'

let db:firebase.firestore.Firestore

//Test Suite GetUser
describe('GET reward/', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        rewards_func = require('../../../src/endpoint_paths/index.ts').rewards

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, RHP_ID, 1, {house_name:"Platinum", floor_id:"4N"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FACULTY, 3, {house_name:"Platinum",})
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name:"Platinum", floor_id:"4S"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)


        await FirestoreDataFactory.setReward(db, "First_Rewards", {required_ppr:10})
        await FirestoreDataFactory.setReward(db, "Second_Rewards",{required_ppr:20})
        await FirestoreDataFactory.setReward(db, "Third_Rewards", {required_ppr:30})

    })

    
    it('Test resident results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, RESIDENT_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
                done()
            } 
        })
    })

    it('Test rhp results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, RHP_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
                done()
            } 
        })
    })

    it('Test Professional staff results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
                done()
            } 
        })
    })

    it('Test FHP results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, FACULTY)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
                done()
            } 
        })
    })

    it('Test PRIV REs results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, PRIV_RES)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
                done()
            } 
        })
    })

    it('Test ea results in success', async (done) => {
        const res = factory.get(rewards_func, ENDPOINT, EA_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.rewards).toHaveLength(3)
                expect(res.body.rewards[0].id).toBe("First_Rewards")
                expect(res.body.rewards[1].id).toBe("Second_Rewards")
                expect(res.body.rewards[2].id).toBe("Third_Rewards")
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


