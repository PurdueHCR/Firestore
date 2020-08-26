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
const FIRST_REWARD = "First_Rewards"

let db:firebase.firestore.Firestore

declare type RewardUpdateBody = {
    id?: string
    fileName?:string
    requiredPPR?:number
    name?: string
    downloadURL?: string
}


//Test Suite GetUser
describe('PUT reward/', () =>{

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


        await FirestoreDataFactory.setReward(db, FIRST_REWARD, {required_ppr:10})
        await FirestoreDataFactory.setReward(db, "Second_Rewards",{required_ppr:20})
        await FirestoreDataFactory.setReward(db, "Third_Rewards", {required_ppr:30})

    })

    it('No id returns Missing required parameters', async (done) => {
        const body:RewardUpdateBody = {fileName:"FILE.png", requiredPPR:14, name:"NAME", downloadURL:"Name.png"}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('only id returns Missing required parameters', async (done) => {
        const body = {id:FIRST_REWARD}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('requiredppr as a string results in bad format', async (done) => {
        const body = {id:FIRST_REWARD, requiredPPR:"BAD_ID"}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Negative requiredppr results in bad format', async (done) => {
        const body = {id:FIRST_REWARD, requiredPPR:-1}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('0 requiredppr results in bad format', async (done) => {
        const body = {id:FIRST_REWARD, requiredPPR:0}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test number as id still returns unknown reward', async (done) => {
        const body = {id:4, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(420)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    
    it('Test resident results in Invalid Permissions', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body, RESIDENT_ID)
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

    it('Test rhp results in Invalid Permissions', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body,  RHP_ID)
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

    it('Test Professional staff results in success', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"NEW FILE", name:"NEW NAME", downloadURL:"NEW_DOWNLOAD.url"}
        const res = factory.put(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const rewardDoc = (await db.collection("Rewards").doc(FIRST_REWARD).get()).data()!
                expect(rewardDoc.DownloadURL).toBe("NEW_DOWNLOAD.url")
                expect(rewardDoc.Name).toBe("NEW NAME",)
                expect(rewardDoc.RequiredPPR).toBe(14)
                expect(rewardDoc.FileName).toBe("NEW FILE")
                await FirestoreDataFactory.setReward(db, FIRST_REWARD, { required_ppr:10})
                done()
            } 
        })
    })

    it('Test FHP results in Invalid Permissions', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body,  FACULTY)
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

    it('Test PRIV REs results in Invalid Permissions', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body,  PRIV_RES)
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

    it('Test ea results in Invalid Permissions', async (done) => {
        const body: RewardUpdateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.put(rewards_func, ENDPOINT, body,  EA_ID)
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
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})


