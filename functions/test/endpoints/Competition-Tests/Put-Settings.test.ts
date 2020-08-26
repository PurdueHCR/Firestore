import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let competition_func

const ENDPOINT = "/settings"

const RESIDENT_ID = "RESIDENT_CONFIRM_RESET_COMPETITION"
const RHP_ID = "RHP_CONFIRM_RESET_COMPETITION"
const PROF_ID = "Proffesional_Staff_CONFIRM_RESET_COMPETITION"
const FHP_ID = "FHPCONFIRM_RESET_COMPETITION"
const PRIV_RES_ID = "PRIV_RES_CONFIRM_RESET_COMPETITION"
const EA_ID = "EA_CONFIRM_RESET_COMPETITION"
let db:firebase.firestore.Firestore


//Test Suite GetUser
describe('PUT competition/settings', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        competition_func = require('../../../src/endpoint_paths/index.ts').competition

        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES_ID, 4, {house_name:"Copper"})
        await FirestoreDataFactory.setUser(db, EA_ID, 5)


    })

    beforeEach(async () =>{
        await FirestoreDataFactory.setSystemPreference(db, {competition_hidden_message:"GHI", house_enabled_message:"JKL", is_house_enabled: false, is_competition_visible:false})
    })

    it('Test resident results in Invalid Permission', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, RESIDENT_ID)
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

    it('Test rhp results in Invalid Permission', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, RHP_ID)
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

    it('Test FHP results in Invalid Permission', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, FHP_ID)
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

    it('Test priv resident results in Invalid Permission', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, PRIV_RES_ID)
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

    it('Test EA results in Invalid Permission', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, EA_ID)
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

    it.skip('Test change none results in Missing parameter', (done) => {
        const body = {}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
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

    it('Test set all', (done) => {
        const body = {isCompetitionVisible:true, competitionHiddenMessage:"ABC", isCompetitionEnabled: true, competitionDisabledMessage:"DEF"}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const syspref = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(syspref.data()!.competitionHiddenMessage).toBe("ABC")
                expect(syspref.data()!.houseEnabledMessage).toBe("DEF")
                expect(syspref.data()!.isHouseEnabled).toBe(true)
                expect(syspref.data()!.isCompetitionVisible).toBe(true)
                done()
            }
        })
    })

    it('Test set visibility only', (done) => {
        const body = {isCompetitionVisible:true}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const syspref = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(syspref.data()!.competitionHiddenMessage).toBe("GHI")
                expect(syspref.data()!.houseEnabledMessage).toBe("JKL")
                expect(syspref.data()!.isHouseEnabled).toBe(false)
                expect(syspref.data()!.isCompetitionVisible).toBe(true)
                done()
            }
        })
    })

    it('Test set enabled only', (done) => {
        const body = {isCompetitionEnabled:true}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const syspref = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(syspref.data()!.competitionHiddenMessage).toBe("GHI")
                expect(syspref.data()!.houseEnabledMessage).toBe("JKL")
                expect(syspref.data()!.isHouseEnabled).toBe(true)
                expect(syspref.data()!.isCompetitionVisible).toBe(false)
                done()
            }
        })
    })

    it('Test set hidden message', (done) => {
        const body = {competitionHiddenMessage:"ABC"}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const syspref = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(syspref.data()!.competitionHiddenMessage).toBe("ABC")
                expect(syspref.data()!.houseEnabledMessage).toBe("JKL")
                expect(syspref.data()!.isHouseEnabled).toBe(false)
                expect(syspref.data()!.isCompetitionVisible).toBe(false)
                done()
            }
        })
    })

    it('Test set disabled message only', (done) => {
        const body = {competitionDisabledMessage:"DEF"}
        const res = factory.put(competition_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const syspref = await db.collection("SystemPreferences").doc("Preferences").get()
                expect(syspref.data()!.competitionHiddenMessage).toBe("GHI")
                expect(syspref.data()!.houseEnabledMessage).toBe("DEF")
                expect(syspref.data()!.isHouseEnabled).toBe(false)
                expect(syspref.data()!.isCompetitionVisible).toBe(false)
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


