import * as factory from '../../HTTPRequestFactory'
import * as firebase from "@firebase/testing"
import * as IntegrationMockFactory from '../IntegrationMockFactory'
import *  as request from 'supertest'
import {FirestoreDataFactory, REWARD_DEFAULTS} from '../FirestoreDataFactory'


let competition_func
let db: firebase.firestore.Firestore

let RESIDENT_ID = "RESIDENT"
let REC_ID = "REC"
let RHP_ID = "RHP"
let PRIV_RES = "PRIV_RES"
let FHP = "FHP"
let NHAS = "Non Honors Affiliated Staff"
let USER_OVERVIEW = "/userOverview"


//Test Suite Submit Points
describe('GET competition/userOverview', () =>{

    beforeAll(async () => {
        
        //Mock firebase-admin so that all calls in the code to db will return the test Firestore database
        IntegrationMockFactory.mockFirebaseAdmin()
        
        //Get the Database for our use
        db = IntegrationMockFactory.getDb()
        
        //Get the User function from the index to test
        competition_func = require('../../../src/endpoint_paths/index.ts').competition

        //Create 6 sample residents
        await FirestoreDataFactory.setUser(db, RESIDENT_ID, 0, {total_points: 1, semester_points: 1})
        for(let i =0; i < 5; i++){
            await FirestoreDataFactory.setUser(db, RESIDENT_ID+" "+i.toString(), 0, {total_points: (i+1)*10, semester_points: (i+1)*10})
        }

        //Create Other permission level users
        await FirestoreDataFactory.setUser(db, RHP_ID, 1)
        await FirestoreDataFactory.setUser(db, REC_ID, 2)
        await FirestoreDataFactory.setUser(db, FHP, 3)
        await FirestoreDataFactory.setUser(db, PRIV_RES, 4, {house_name:"Silver"})
        await FirestoreDataFactory.setUser(db, NHAS, 5)

        //Create houses
        await FirestoreDataFactory.setAllHouses(db,
            {
                copper:{total_points:0, num_residents: 200}, 
                palladium:{total_points:200, num_residents: 200}, 
                platinum:{total_points:2000, num_residents: 200}, 
                silver:{total_points:600, num_residents: 200}, 
                titanium:{total_points:1600, num_residents: 200}
            }
        )
        //Create pointlogs for a user
        await FirestoreDataFactory.createMultiplePointLogs(db,"Platinum",RESIDENT_ID,10)
        await FirestoreDataFactory.createMultiplePointLogs(db,"Platinum",RHP_ID,3)

        //Create sample rewards
        await FirestoreDataFactory.setReward(db, {id:"T-Shirts", required_ppr: 5}) // Tshirts reard 5 ppr
        await FirestoreDataFactory.setReward(db)// Default Reward 100 ppr
    })

    beforeEach(async() =>{
        // Reset the House competition sys preferences
        await FirestoreDataFactory.setSystemPreference(db)  
    })


    //Test if competition is hidden
    it('Competition Hidden', async(done) => {
        //Set competition invisible
        await FirestoreDataFactory.setSystemPreference(db, {is_competition_visible:false})
        //Test with resident
        const res: request.Test = factory.get(competition_func,USER_OVERVIEW,RESIDENT_ID)
        res.end(async function(err, res){
            if(err){
                done(err)
            }
            else{
                //If the competition is hidden, dont show rank, or houses, or reward
                expect(res.status).toBe(200)
                //Make sure that the keys are defined, but that they are empty
                expect(Object.getOwnPropertyNames(res.body.resident.user_rank)).toHaveLength(0)
                expect(Object.getOwnPropertyNames(res.body.resident.next_reward)).toHaveLength(0)
                expect(res.body.resident.houses).toHaveLength(0)
                expect(res.body.resident.last_submissions).toHaveLength(5)
                done()
            }
        })
    })




    //Test if competition disabled
    it('Competition Disabled', async(done) => {
        //Set competition disabled
        await FirestoreDataFactory.setSystemPreference(db, {is_house_enabled:false})
        //Test with resident
        const res: request.Test = factory.get(competition_func,USER_OVERVIEW,RESIDENT_ID)
        res.end(async function(err, res){
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                done()
            }
        })
    })

    //Test if user is RHP
    it('Test RHP success', async(done) => {
        const res: request.Test = factory.get(competition_func, USER_OVERVIEW, RHP_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.resident).toBeUndefined();
                expect(res.body.rhp).toBeDefined();
                expect(res.body.proffesional_staff).toBeUndefined();
                expect(res.body.fhp).toBeUndefined();
                expect(res.body.privileged_res).toBeUndefined();
                expect(res.body.ea).toBeUndefined();
                //Check user rank
                expect(res.body.rhp.user_rank.houseRank).toBe(7)
                expect(res.body.rhp.user_rank.semesterRank).toBe(7)

                //Check houses
                expect(res.body.rhp.houses[0].id).toBe("Platinum")
                expect(res.body.rhp.houses[0].pointsPerResident).toBe(10)
                expect(res.body.rhp.houses[1].id).toBe("Titanium")
                expect(res.body.rhp.houses[1].pointsPerResident).toBe(8)
                expect(res.body.rhp.houses[2].id).toBe("Silver")
                expect(res.body.rhp.houses[2].pointsPerResident).toBe(3)
                expect(res.body.rhp.houses[3].id).toBe("Palladium")
                expect(res.body.rhp.houses[3].pointsPerResident).toBe(1)
                expect(res.body.rhp.houses[4].id).toBe("Copper")
                expect(res.body.rhp.houses[4].pointsPerResident).toBe(0)

                //check next reward

                expect(res.body.rhp.next_reward.id).toBe(REWARD_DEFAULTS.id)
                expect(res.body.rhp.next_reward.fileName).toBe(REWARD_DEFAULTS.id+".png")
                expect(res.body.rhp.next_reward.requiredPPR).toBe(REWARD_DEFAULTS.required_ppr)

                //Check last submissions
                expect(res.body.rhp.last_submissions).toHaveLength(3)
                
                done();
            }
        })
    })

    //Test if user is RHP, REC, FHP, NHAS
    it('Test REC', async(done) => {
        //Test with resident
        const res: request.Test = factory.get(competition_func,USER_OVERVIEW,REC_ID)
        res.end(async function(err, res){
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    //Test if user is RHP, REC, FHP, NHAS
    it('Test FHP', async(done) => {
        //Test with resident
        const res: request.Test = factory.get(competition_func,USER_OVERVIEW,FHP)
        res.end(async function(err, res){
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })


    //Test priv resident Invalid Access
    it('Privileged Resident Invalid Access', async(done) =>{
        const res: request.Test = factory.get(competition_func, USER_OVERVIEW, PRIV_RES)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)
                expect(res.body.resident).toBeUndefined();
                expect(res.body.rhp).toBeUndefined();
                expect(res.body.proffesional_staff).toBeUndefined();
                expect(res.body.fhp).toBeUndefined();
                expect(res.body.privileged_resident).toBeDefined();
                expect(res.body.ea).toBeUndefined();
                //Check user rank
                expect(res.body.privileged_resident.user_rank.houseRank).toBe(1)
                expect(res.body.privileged_resident.user_rank.semesterRank).toBe(1)

                //Check houses
                expect(res.body.privileged_resident.houses[0].id).toBe("Platinum")
                expect(res.body.privileged_resident.houses[0].pointsPerResident).toBe(10)
                expect(res.body.privileged_resident.houses[1].id).toBe("Titanium")
                expect(res.body.privileged_resident.houses[1].pointsPerResident).toBe(8)
                expect(res.body.privileged_resident.houses[2].id).toBe("Silver")
                expect(res.body.privileged_resident.houses[2].pointsPerResident).toBe(3)
                expect(res.body.privileged_resident.houses[3].id).toBe("Palladium")
                expect(res.body.privileged_resident.houses[3].pointsPerResident).toBe(1)
                expect(res.body.privileged_resident.houses[4].id).toBe("Copper")
                expect(res.body.privileged_resident.houses[4].pointsPerResident).toBe(0)

                //check next reward

                expect(res.body.privileged_resident.next_reward.id).toBe("T-Shirts")
                expect(res.body.privileged_resident.next_reward.fileName).toBe("T-Shirts.png")
                expect(res.body.privileged_resident.next_reward.requiredPPR).toBe(5)

                //Check last submissions
                expect(res.body.privileged_resident.last_submissions).toHaveLength(0)
                
                done();
            }
        })
    })

    //Test if user is RHP, REC, FHP, NHAS
    it('Test NHAS', async(done) => {
        //Test with resident
        const res: request.Test = factory.get(competition_func,USER_OVERVIEW,NHAS)
        res.end(async function(err, res){
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(403)
                done()
            }
        })
    })

    //Test resident success
    it('Resident overview Success', async(done) =>{
        const res: request.Test = factory.get(competition_func, USER_OVERVIEW, RESIDENT_ID)
        res.end(async function (err, res) {
            if(err){
                done(err)
            }
            else{
                expect(res.status).toBe(200)

                //Check user rank
                expect(res.body.resident.user_rank.houseRank).toBe(6)
                expect(res.body.resident.user_rank.semesterRank).toBe(6)

                //Check houses
                expect(res.body.resident.houses[0].id).toBe("Platinum")
                expect(res.body.resident.houses[0].pointsPerResident).toBe(10)
                expect(res.body.resident.houses[1].id).toBe("Titanium")
                expect(res.body.resident.houses[1].pointsPerResident).toBe(8)
                expect(res.body.resident.houses[2].id).toBe("Silver")
                expect(res.body.resident.houses[2].pointsPerResident).toBe(3)
                expect(res.body.resident.houses[3].id).toBe("Palladium")
                expect(res.body.resident.houses[3].pointsPerResident).toBe(1)
                expect(res.body.resident.houses[4].id).toBe("Copper")
                expect(res.body.resident.houses[4].pointsPerResident).toBe(0)

                //check next reward

                expect(res.body.resident.next_reward.id).toBe(REWARD_DEFAULTS.id)
                expect(res.body.resident.next_reward.fileName).toBe(REWARD_DEFAULTS.id+".png")
                expect(res.body.resident.next_reward.requiredPPR).toBe(REWARD_DEFAULTS.required_ppr)

                //Check last submissions
                expect(res.body.resident.last_submissions).toHaveLength(5)
                
                done();
            }
        })
    })



    //After all of the tests are done, make sure to delete the test firestore app
    afterAll(async ()=>{
        await FirestoreDataFactory.cleanDatabase(db)
        Promise.all(firebase.apps().map(app => app.delete()))
    })

})