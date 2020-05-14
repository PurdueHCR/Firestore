export class UserRank {

    static HOUSE_RANK = "houseRank"
    static SEMESTER_RANK = "semesterRank"

    houseRank: number
    semesterRank: number

    constructor(houseRank: number, semesterRank: number){
        this.houseRank = houseRank
        this.semesterRank = semesterRank
    }

    toJson(){
        const data = {}
        data[UserRank.HOUSE_RANK] = this.houseRank
        data[UserRank.SEMESTER_RANK] = this.semesterRank
        return data
    }

}