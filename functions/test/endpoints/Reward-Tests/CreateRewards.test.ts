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
const FIRST_REWARD = "NEW_REWARD"

let db:firebase.firestore.Firestore

declare type RewardCreateBody = {
    id?:string,
    fileName?:string,
    requiredPPR?:number,
}


//Test Suite GetUser
describe('POST reward/', () =>{

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


        await FirestoreDataFactory.setReward(db, {id:"First_Rewards", required_ppr:10})
        await FirestoreDataFactory.setReward(db, {id:"Second_Rewards", required_ppr:20})
        await FirestoreDataFactory.setReward(db, {id:"Third_Rewards", required_ppr:30})

    })

    it('No id returns Missing required parameters', async (done) => {
        const body: RewardCreateBody = {requiredPPR:14, fileName:"FILENAME"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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

    it('No filename returns Missing required parameters', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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

    it('No requiredPPR returns Missing required parameters', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, fileName:"FILENAME"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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
        const body = {id:FIRST_REWARD, requiredPPR:"BAD_ID", fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:-1}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:0, fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
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
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"asdf"}
        const res = factory.post(rewards_func, ENDPOINT, body, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test rhp results in Invalid Permissions', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test Professional staff results in success', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"NEW FILE"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.id).toBe(FIRST_REWARD)
                expect(res.body.requiredPPR).toBe(14)
                expect(res.body.fileName).toBe("NEW FILE")
                const rewardDoc = (await db.collection("Rewards").doc(FIRST_REWARD).get()).data()!
                expect(rewardDoc.RequiredPPR).toBe(14)
                expect(rewardDoc.FileName).toBe("NEW FILE")
                await db.collection("Rewards").doc(FIRST_REWARD).delete()
                done()
            } 
        })
    })

    it('Test FHP results in Invalid Permissions', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  FACULTY)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test PRIV REs results in Invalid Permissions', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PRIV_RES)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test ea results in Invalid Permissions', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"ASDF"}
        const res = factory.post(rewards_func, ENDPOINT, body,  EA_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
                done()
            } 
        })
    })

    it('Test add a reward with the same id results in RewardAlreadyExists', async (done) => {
        const body: RewardCreateBody = {id:FIRST_REWARD, requiredPPR:14, fileName:"NEW FILE"}
        const res = factory.post(rewards_func, ENDPOINT, body,  PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(470)
                const rewardDocs = (await db.collection("Rewards").get()).docs
                expect(rewardDocs).toHaveLength(3)
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


