///-----------------------------------------------------------------
///   Description:    Model that holds user rankings for a house. In the database, it is in Houses/<House_id>/Details/Rank
///   Author:         Brian Johncox                    Date: 7/27/2020
///   Notes:          
///   Revision History:
///   Name:           Date:        Description:
///-----------------------------------------------------------------


export class UserHouseRank{
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

    toFirestoreJson():any{
        const map = {}
        map[this.residentId] = {
            firstName:this.firstName,
            lastName:this.lastName,
            totalPoints:this.totalPoints,
            semesterPoints:this.semesterPoints
        }
        return map
    }

}

export class RankArray {
    users:UserHouseRank[]

    constructor(users: UserHouseRank[]){
        this.users = users
    }

    getYearlyRank() : UserHouseRank[]{
        this.users.sort((a,b)=>b.totalPoints-a.totalPoints)
        return this.users
    }

    getSemesterRank() : UserHouseRank[]{
        this.users.sort((a,b)=>b.semesterPoints-a.semesterPoints)
        return this.users
    }

    toFirestoreJson(): any {
        let map = {}
        for(const user of this.users){
            //Funky syntax to merge objects
            map = {...map, ...user.toFirestoreJson()}
        }
        return map
    }


    static fromDocumentSnapshot(document: FirebaseFirestore.DocumentSnapshot): RankArray{
        const users:UserHouseRank[] = []
        if(document.exists){
            console.log("PArsing: "+JSON.stringify(document.data()!))
            Object.keys(document.data()!).forEach((key:string)=>{
                const user = document.data()![key]
                users.push(new UserHouseRank(key, user.firstName, user.lastName, user.totalPoints, user.semesterPoints))
            })
            users.sort((a,b) => b.totalPoints - a.totalPoints)
        }
        return new RankArray(users)
    }
}

