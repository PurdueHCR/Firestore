///-----------------------------------------------------------------
///   Description:    Model that holds user rankings for a house. In the database, it is in Houses/<House_id>/Details/Rank
///   Author:         Brian Johncox                    Date: 7/27/2020
///   Notes:          
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------

import { User } from "./User"


export class RankArray {
    users:UserScore[]

    constructor(users: UserScore[]){
        this.users = users
    }

    incrementUser(user:User, increment:number){
        const userScore = this.users.find((item) => item.residentId === user.id)
        if(userScore === undefined || userScore == null){
            this.users.push(new UserScore(user.id, user.firstName, user.lastName, user.totalPoints + increment, user.semesterPoints + increment))
        }
        else{
            userScore.totalPoints += increment
            userScore.semesterPoints += increment
        }
        

    }

    toFirestoreJson():any{
        const map = {}
        map["users"] = this.users.map((obj)=> {return Object.assign({}, obj)})
        return map
    }

    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): RankArray{
        const users:UserScore[] = []
        for(const user of document.data()!.users){
            users.push(new UserScore(user.residentId, user.firstName, user.lastName, user.totalPoints, user.semesterPoints))
        }
        return new RankArray(users)
    }
}

export class UserScore{
    residentId: string
    firstName: string
    lastName: string
    totalPoints: number
    semesterPoints: number

    constructor(residentId:string, firstName: string, lastName: string, totalPoints: number, semesterPoints: number){
        this.residentId = residentId
        this.firstName = firstName
        this.lastName = lastName
        this.totalPoints = totalPoints
        this.semesterPoints = semesterPoints
    }

}