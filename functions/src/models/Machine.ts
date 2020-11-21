export class Machine {
    
    static BUILDING = "building"
    static MACHINEID = "machineId"
    static STATUS =  "status"
    static TIME = "time"
    static TYPE = "type"

    building: string
    machineId: string
    status: string
    time: number
    type: string

    constructor(building: string, machineId: string, status: string, time: number, type: string) {
        this.building = building
        this.machineId = machineId
        this.status = status
        this.time = time
        this.type = type
    }

    firestoreJson() {
        const data = {}
        data[Machine.BUILDING] = this.building
        data[Machine.MACHINEID] = this.machineId
        data[Machine.STATUS] = this.status
        data[Machine.TIME] = this.time
        data[Machine.TYPE] = this.type
        return data
    }
    
    static fromDocument(document: FirebaseFirestore.DocumentSnapshot): Machine[] {
        const machines: Machine[] = []
        for(const key in document.data()) {
            const machine = document.data()![key]
            machines.push(new Machine(machine[Machine.BUILDING], machine[Machine.MACHINEID], machine[Machine.STATUS], machine[Machine.TIME], machine[Machine.TYPE]))
        }
        return machines
    }
}
