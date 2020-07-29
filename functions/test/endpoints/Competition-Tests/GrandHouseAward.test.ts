import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let comp_func
const RESIDENT_ID = "RESIDENT_GetUnhandledPointLogs"
const RHP_ID = "RHP_GetUnhandledPointLogs"
const PROF_ID = "Proffesional Staff_GetUnhandledPointLogs"
const FHP_ID = "FHP_GetUnhandledPointLogs"
const PRIV_RES = "PRIV_RES_GetUnhandledPointLogs"
const EA = "External Advisor_GetUnhandledPointLogs"
let db:firebase.firestore.Firestore

const ENDPOINT = "/houseAward"

declare type HouseAward = {
    house?:string
    ppr?:number
    description?:string
}

//Test Suite GetUser
describe('POST competition/houseAward', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        comp_func = require('../../../src/endpoint_paths/index.ts').competition

        await FirestoreDataFactory.setSystemPreference(db)
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA, 5)

        await FirestoreDataFactory.setAllHouses(db, {platinum:{total_points: 2000, num_residents: 200}})


    })

    it('Test empty body results in Missing required Parameters', (done) => {
        const body:HouseAward = {}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
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

    it('Test missing house results in missing required parameters', (done) => {
        const body:HouseAward = {ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
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

    it('Test missing ppr results in missing required parameters', (done) => {
        const body:HouseAward = {house:"Platinum", description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
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

    it('Test Invalid PPR results in Invalid format', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:0, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                done()
            }
        })
    })

    it('Test missing description results in missing required parameters', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
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

    it('Test invalid ppr', (done) => {
        const body = {house:"Platinum", ppr:"BAD", description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(426)
                done()
            }
        })
    })

    it('Test Invalid House', (done) => {
        const body:HouseAward = {house:"PLAT", ppr:20, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(425)
                done()
            }
        })
    })
    
    it('Test Resident post results in InvalidPermission', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, RESIDENT_ID)
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
    
    it('Test RHP post results in InvalidPermission', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, RHP_ID)
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

    it('Test Faculty Advisor post results in InvalidPermission', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, FHP_ID)
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

    it('Test Privileged Resident post results in InvalidPermission', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PRIV_RES)
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

    it('Test External Advisor post results in InvalidPermission', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, EA)
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

    it('Test Professional Staff successfully grant award', (done) => {
        const body:HouseAward = {house:"Platinum", ppr:10, description:"Test Award"}
        const res = factory.post(comp_func, ENDPOINT, body, PROF_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                const house = (await db.collection("House").doc("Platinum").get()).data()!
                expect(house.TotalPoints).toBe(4000)
                expect(house.HouseAwards).toHaveLength(1)
                expect(house.HouseAwards[0].PointsPerResident).toBe(10)
                expect(house.HouseAwards[0].Description).toBe("Test Award")
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


