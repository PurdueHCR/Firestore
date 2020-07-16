import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing";
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import {FirestoreDataFactory} from '../FirestoreDataFactory'

let competition_func

const ENDPOINT = "/history"

const PLATINUM_RESIDENT_ID = "PLATINUM_RESIDENT_HISTORY"
const COPPER_RESIDENT_ID = "COPPER_RESIDENT_HISTORY"
const SILVER_RESIDENT_ID = "SILVER_RESIDENT_ID_HISTORY"

const COPPER_RHP_ID = "COPPER_RHP_HISTORY"
const PLAT_RHP_ID = "PLAT_RHP_HISTORY"
const SILVER_RHP_ID = "PLAT_RHP_HISTORY"
const TITANIUM_RHP_ID = "TITANIUM_RHP_HISTORY"

const PROF_ID = "Proffesional Staff_HISTORY"
const FHP_ID = "FHP_HISTORY"
const PRIV_RES = "PRIV_RES_HISTORY"
const EA = "External_Advisor_HISTORY"
let db:firebase.firestore.Firestore

declare type HistoryParams = {
    type:string,
    house?:string,
    point_type_id?:number,
    last_name?:string,
    date?:string,
    startAt?:string
}

//Test Suite GetUser
describe('GET competition/history', () =>{

    beforeAll(async () => {
        IntegrationMockFactory.mockFirebaseAdmin()
        db = IntegrationMockFactory.getDb()

        competition_func = require('../../../src/endpoint_paths/index.ts').competition

        await FirestoreDataFactory.setUser(db, PLATINUM_RESIDENT_ID, 0)
        await FirestoreDataFactory.setUser(db, COPPER_RESIDENT_ID, 0, {house_name:"Copper"})
        await FirestoreDataFactory.setUser(db, SILVER_RESIDENT_ID, 0, {house_name:"Silver"})


        await FirestoreDataFactory.setUser(db, PLAT_RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, COPPER_RHP_ID, 1, {house_name:"Copper"})
        await FirestoreDataFactory.setUser(db, SILVER_RHP_ID, 1, {house_name:"Silver"})
        await FirestoreDataFactory.setUser(db, TITANIUM_RHP_ID, 1, {house_name:"Titanium"})
        await FirestoreDataFactory.setUser(db, PROF_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP_ID, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4)
        await FirestoreDataFactory.setUser(db, EA, 5)

        //Give no point logs to Titanium

        //Give 30 Point logs to Copper which different ranks and different users
        for(let i = 0; i < 30; i++){
            await FirestoreDataFactory.setPointLog(db, "Copper", COPPER_RESIDENT_ID, (i % 4) == 0, {
                approved: (i%2 == 0), 
                date_submitted: new Date("1/"+(i+1).toString()+"/2020"),
                resident_last_name: (i % 3 == 0)? "Last1":(i % 3 == 1)? "Last2":"Last3",
                point_type_id: (i %10) + 1
            })
            await FirestoreDataFactory.setPointLog(db, "Silver", SILVER_RESIDENT_ID, true, {
                approved: (i%2 == 0), 
                date_submitted: new Date("1/"+(i+1).toString()+"/2020"),
                resident_last_name: "Last1",
                point_type_id: 1
            })
        }


    })

    it('No query params results in MissingParams Error', (done) => {
        const params = {}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('No type field results in MissingParams Error', (done) => {
        const params = {point_type_id: 0, last_name:"Doe", date: "4/12/2020", house:"Platinum", startAt: "4/12/2020"}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('Invalid Type results in IncorrectFormat Error', (done) => {
        const params:HistoryParams = {type: 'unknown', point_type_id: 0, last_name:"Doe", date: "4/12/2020", house:"Platinum", startAt: "4/12/2020"}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('Invalid date results in InvalidDate Error', (done) => {
        const params:HistoryParams = {type: 'recent', point_type_id: 0, last_name:"Doe", date: "dfsghjkl", house:"Platinum", startAt: "4/12/2020"}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(423)
                done()
            }
        })
    })

    it('Invalid start at date results in InvalidDate Error', (done) => {
        const params:HistoryParams = {type: 'recent', point_type_id: 0, last_name:"Doe", date: "4/12/2020", house:"Platinum", startAt: "4asdf0" }
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(423)
                done()
            }
        })
    })

    it('Type is user but no last name is provided results in Missing Params', (done) => {
        const params:HistoryParams = {type: 'user'}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('Type is point_type but no point_type_id is provided results in Missing Params', (done) => {
        const params:HistoryParams = {type: 'point_type'}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('point type id is an invalid number results in Incorrect Format', (done) => {
        const params:HistoryParams = {type: 'point_type', point_type_id:-1}
        const res = factory.get(competition_func, ENDPOINT, PLAT_RHP_ID, params)
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

    it('Request is made by a Proff_staff account but no house is provided results in Missing Param', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, PROF_ID, params)
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

    it('Request is made by a Proff_staff account but an invalid house is provided results in Unknown House Id', (done) => {
        const params:HistoryParams = {type: 'recent', house:'Platinuts'}
        const res = factory.get(competition_func, ENDPOINT, PROF_ID, params)
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

    it('Request made by a resident results in Invalid Permission', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, PLATINUM_RESIDENT_ID, params)
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

    it('Request made by an FHP results in Invalid Permission', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, FHP_ID, params)
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

    it('Request made by a Privileged resident results in Invalid Permission', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, PRIV_RES, params)
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

    it('Request made by a External Edvisor results in Invalid Permission', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, EA, params)
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

    it('Using a user that doesnt exist results in Unknown User', (done) => {
        const params:HistoryParams = {type: 'recent', house: 'Platinum'}
        const res = factory.get(competition_func, ENDPOINT, "Unknown User", params)
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
    
    it('Requesting recent history with no points results in empty array', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, TITANIUM_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(0)
                done()
            }
        })
    })

    it('Requesting user with no points results in empty array', (done) => {
        const params:HistoryParams = {type: 'user', last_name: 'last'}
        const res = factory.get(competition_func, ENDPOINT, TITANIUM_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(0)
                done()
            }
        })
    })

    it('Requesting type = point_type with no points results in empty array', (done) => {
        const params:HistoryParams = {type: 'point_type', point_type_id: 1}
        const res = factory.get(competition_func, ENDPOINT, TITANIUM_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(0)
                done()
            }
        })
    })

    it('Recent and no page results in 25 dates in reverse chronological order', (done) => {
        const params:HistoryParams = {type: 'recent'}
        const res = factory.get(competition_func, ENDPOINT, COPPER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(25)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual((new Date("1/30/2020")))
                expect(new Date(res.body.point_logs[24].dateSubmitted.seconds * 1000)).toEqual(new Date("1/6/2020"))
                done()
            }
        })
    })

    it('Passing startDate results in limited query for recent', (done) => {
        const params:HistoryParams = {type: 'recent', startAt: "1/6/2020"}
        const res = factory.get(competition_func, ENDPOINT, COPPER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(5)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/5/2020"))
                expect(new Date(res.body.point_logs[4].dateSubmitted.seconds * 1000)).toEqual(new Date("1/1/2020"))
                done()
            }
        })
    })

    it('Passing startDate results in limited query for user', (done) => {
        const params:HistoryParams = {type: 'user', last_name: "Last1", startAt: "1/6/2020"}
        const res = factory.get(competition_func, ENDPOINT, SILVER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(5)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/5/2020"))
                expect(new Date(res.body.point_logs[4].dateSubmitted.seconds * 1000)).toEqual(new Date("1/1/2020"))
                done()
            }
        })
    })

    it('Passing startDate results in limited query for point_type', (done) => {
        const params:HistoryParams = {type: 'point_type', point_type_id: 1, startAt: "1/6/2020"}
        const res = factory.get(competition_func, ENDPOINT, SILVER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(5)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/5/2020"))
                expect(new Date(res.body.point_logs[4].dateSubmitted.seconds * 1000)).toEqual(new Date("1/1/2020"))
                done()
            }
        })
    })

    it('Test filter by user last name', (done) => {
        const params:HistoryParams = {type: 'user', last_name:"Last1"}
        const res = factory.get(competition_func, ENDPOINT, COPPER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(10)
                expect(new Date(res.body.point_logs[9].dateSubmitted.seconds * 1000)).toEqual(new Date("1/1/2020"))
                expect(res.body.point_logs[9].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[8].dateSubmitted.seconds * 1000)).toEqual(new Date("1/4/2020"))
                expect(res.body.point_logs[8].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[7].dateSubmitted.seconds * 1000)).toEqual(new Date("1/7/2020"))
                expect(res.body.point_logs[7].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[6].dateSubmitted.seconds * 1000)).toEqual(new Date("1/10/2020"))
                expect(res.body.point_logs[6].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[5].dateSubmitted.seconds * 1000)).toEqual(new Date("1/13/2020"))
                expect(res.body.point_logs[5].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[4].dateSubmitted.seconds * 1000)).toEqual(new Date("1/16/2020"))
                expect(res.body.point_logs[4].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[3].dateSubmitted.seconds * 1000)).toEqual(new Date("1/19/2020"))
                expect(res.body.point_logs[3].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[2].dateSubmitted.seconds * 1000)).toEqual(new Date("1/22/2020"))
                expect(res.body.point_logs[2].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[1].dateSubmitted.seconds * 1000)).toEqual(new Date("1/25/2020"))
                expect(res.body.point_logs[1].residentLastName).toEqual("Last1")
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/28/2020"))
                expect(res.body.point_logs[0].residentLastName).toEqual("Last1")
                done()
            }
        })
    })

    //This will only get handled points.
    it('Test filter by point type id', (done) => {
        const params:HistoryParams = {type: 'point_type', point_type_id: 1}
        const res = factory.get(competition_func, ENDPOINT, COPPER_RHP_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(2)
                expect(new Date(res.body.point_logs[1].dateSubmitted.seconds * 1000)).toEqual(new Date("1/1/2020"))
                expect(res.body.point_logs[1].pointTypeId).toEqual(1)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/21/2020"))
                expect(res.body.point_logs[0].pointTypeId).toEqual(1)
                done()
            }
        })
    })

    it('Proffessional Staff with house results in success', (done) => {
        const params:HistoryParams = {type: 'recent', house: 'Copper'}
        const res = factory.get(competition_func, ENDPOINT, PROF_ID, params)
        res.end(function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.point_logs).toHaveLength(25)
                expect(new Date(res.body.point_logs[0].dateSubmitted.seconds * 1000)).toEqual(new Date("1/30/2020"))
                expect(new Date(res.body.point_logs[24].dateSubmitted.seconds * 1000)).toEqual(new Date("1/6/2020"))
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


