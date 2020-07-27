import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let competition_func

const ENDPOINT = "/confirmResetCompetition"

const RESIDENT_ID = "RESIDENT_CONFIRM_RESET_COMPETITION"
const RHP_ID = "RHP_CONFIRM_RESET_COMPETITION"
const PROF_ID = "Proffesional_Staff_CONFIRM_RESET_COMPETITION"
const FHP_ID = "FHPCONFIRM_RESET_COMPETITION"
const PRIV_RES_ID = "PRIV_RES_CONFIRM_RESET_COMPETITION"
const EA_ID = "EA_CONFIRM_RESET_COMPETITION"
let db:firebase.firestore.Firestore


//Test Suite GetUser
describe('GET competition/confirmResetCompetition', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        IntegrationMockFactory.mockOTCGenerator()
        db = IntegrationMockFactory.getDb()

        competition_func = require('../../../src/endpoint_paths/index.ts').competition

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES_ID, 4, {house_name:"Copper"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)

        await FirestoreDataFactory.setAllHouses(db,
            {
                copper:{total_points:0, num_residents: 200}, 
                palladium:{total_points:200, num_residents: 200}, 
                platinum:{total_points:2000, num_residents: 200}, 
                silver:{total_points:600, num_residents: 200}, 
                titanium:{total_points:1600, num_residents: 200}
            }
        )
        
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})

        for(let i = 0; i < 50; i++){
            await FirestoreDataFactory.setUser(db, RESIDENT_ID + i.toString(), 0)
        }
        for(let i = 0; i < 10; i++){
            await FirestoreDataFactory.setPointType(db, i +1)
        }

        for(let i = 0; i < 5; i++){
            await FirestoreDataFactory.setReward(db, "ITEM "+i.toString())
        }

        for(let i = 0; i < 10; i++){
            await FirestoreDataFactory.setHouseCode(db, (i+1).toString())
        }

        for(let i = 0; i < 10; i ++){
            await FirestoreDataFactory.setLink(db, (i+1).toString(), PROF_ID, 1)
        }

        for(let i = 0; i < 10; i ++){
            await FirestoreDataFactory.setPointLog(db, "Platinum",RESIDENT_ID, false)
        }

        await FirestoreDataFactory.setPointLog(db, "Platinum", RESIDENT_ID, false, {id:"TEST_LOG"})

        for(let i = 0; i < 10; i ++){
            await FirestoreDataFactory.setPointLogMessage(db, "Platinum","TEST_LOG")
        }

    })

    it('Code must exist in the query', (done) => {
        const params = {user:PROF_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    it('user must exist in the query', (done) => {
        const params = {code:"TESTTOKEN"}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(422)
                done()
            }
        })
    })

    it('User is resident results in Invalid Permissions', (done) => {
        const params = {code:"TESTTOKEN",user:RESIDENT_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
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

    it('User is rhp results in Invalid Permissions', (done) => {
        const params = {code:"TESTTOKEN",user:RHP_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
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

    it('User is fhp results in Invalid Permissions', (done) => {
        const params = {code:"TESTTOKEN",user:FHP_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
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

    it('User is priv_res results in Invalid Permissions', (done) => {
        const params = {code:"TESTTOKEN",user:PRIV_RES_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
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

    it('User is EA results in Invalid Permissions', (done) => {
        const params = {code:"TESTTOKEN",user:EA_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
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

    it('User doesnt exist results in Unknown User', (done) => {
        const params = {code:"TESTTOKEN",user:"UNKOWN USER"}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(400)
                done()
            }
        })
    })

    it('Competition not disabled results in error', async (done) => {
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: true})
        const params = {code:"TESTTOKEN",user:PROF_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(414)
                await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled: false})
                done()
            }
        })
    })

    it('One time code is invalid results in InvalidOTC error', (done) => {
        const params = {code:"BAD_TOKEN",user:PROF_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(405)
                done()
            }
        })
    })

    it('Test success', async (done) => {
        const pointTypeDocs = await db.collection("PointTypes").get()
        expect(pointTypeDocs.docs.length).toBe(10)
        const params = {code:"TESTTOKEN",user:PROF_ID}
        const res = factory.get(competition_func, ENDPOINT, "", params)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                
                const sysDoc = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(sysDoc.exists).toBeTruthy()

                const pointTypeDocs = await db.collection("PointTypes").get()
                expect(pointTypeDocs.docs.length).toBe(10)

                const userDocs = await db.collection("Users").get()
                expect(userDocs.docs.length).toBe(1)
                expect(userDocs.docs[0].id).toBe(PROF_ID)

                const houseDocs = await db.collection("House").get()
                expect(houseDocs.docs.length).toBe(5)
                expect(houseDocs.docs[0].data().Color).toBeDefined()
                expect(houseDocs.docs[0].data().NumberOfResidents).toBeDefined()
                expect(houseDocs.docs[0].data().TotalPoints).toBeDefined()
                expect(houseDocs.docs[1].data().Color).toBeDefined()
                expect(houseDocs.docs[1].data().NumberOfResidents).toBeDefined()
                expect(houseDocs.docs[1].data().TotalPoints).toBeDefined()
                expect(houseDocs.docs[2].data().Color).toBeDefined()
                expect(houseDocs.docs[2].data().NumberOfResidents).toBeDefined()
                expect(houseDocs.docs[2].data().TotalPoints).toBeDefined()
                expect(houseDocs.docs[3].data().Color).toBeDefined()
                expect(houseDocs.docs[3].data().NumberOfResidents).toBeDefined()
                expect(houseDocs.docs[3].data().TotalPoints).toBeDefined()
                expect(houseDocs.docs[4].data().Color).toBeDefined()
                expect(houseDocs.docs[4].data().NumberOfResidents).toBeDefined()
                expect(houseDocs.docs[4].data().TotalPoints).toBeDefined()

                const rewardDocs = await db.collection("Rewards").get()
                expect(rewardDocs.docs.length).toBe(5)

                const houseCodeDocs = await db.collection("HouseCodes").get()
                expect(houseCodeDocs.docs.length).toBe(10)

                const pointlogmessages = await db.collection("House").doc("Platinum").collection("Points").doc("TEST_LOG").collection("Messages").get()
                expect(pointlogmessages.docs.length).toBe(0)

                const pointlog = await db.collection("House").doc("Platinum").collection("Points").get()
                expect(pointlog.docs.length).toBe(0)
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


