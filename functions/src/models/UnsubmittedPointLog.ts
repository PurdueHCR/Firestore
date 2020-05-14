import { PointLog } from "./PointLog"

export class UnsubmittedPointLog extends PointLog{
    
    constructor(dateOccurred: Date, description: string, pointTypeId: number){
        super("", null,null, dateOccurred, new Date(Date.now()), description, "", pointTypeId, 0,"","","",0)
    }
}