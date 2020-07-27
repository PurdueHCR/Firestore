///-----------------------------------------------------------------
///   Description:    Model that holds user rankings for a house. In the database, it is in Houses/<House_id>/Details/Rank
///   Author:         Brian Johncox                    Date: 7/27/2020
///   Notes:          
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------


export class RankArray {
    users:UserScore[]

    constructor(users: UserScore[]){
        this.users = users
    }

    getYearlyRank() : UserScore[]{
        this.users.sort((a,b)=>a.totalPoints-b.totalPoints)
        return this.users
    }

    getSemesterRank() : UserScore[]{
        this.users.sort((a,b)=>a.semesterPoints-b.semesterPoints)
        return this.users
    }


    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): RankArray{
        const users:UserScore[] = []
        if(document.exists){
            for(const user of document.data()!.users){
                users.push(new UserScore(user.residentId, user.firstName, user.lastName, user.totalPoints, user.semesterPoints))
            }
            Object.keys(document.data()!).forEach((key:string)=>{
                const user = document.data()![key]
                users.push(new UserScore(key, user.firstName, user.lastName, user.totalPoints, user.semesterPoints))
            })
            users.sort((a,b) => a.totalPoints - b.totalPoints)
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