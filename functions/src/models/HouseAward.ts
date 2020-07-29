
export class HouseAward{
    static DESCRIPTION = "Description"
    static POINTS_PER_RESIDENT = "PointsPerResident"

    description:string
    pointsPerResident:number

    constructor(description:string, pointsPerResident:number){
        this.description = description
        this.pointsPerResident = pointsPerResident
    }

    toFirestoreJson(){
        const data = {}
        data[HouseAward.DESCRIPTION] = this.description
        data[HouseAward.POINTS_PER_RESIDENT] = this.pointsPerResident
        return data
    }

    static fromHouseData(data:any[]): HouseAward[]{
        const awards:HouseAward[] = []
        for(const award of data){
            awards.push(new HouseAward(award[HouseAward.DESCRIPTION],award[HouseAward.POINTS_PER_RESIDENT]))
        }
        return awards
    }

}