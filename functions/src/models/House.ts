
export class House {

    static COLOR = "Color"
    static NUMBER_OF_RESIDENTS = "NumberOfResidents"
    static TOTAL_POINTS =  "TotalPoints"

    color: String
    numberOfResidents: number
    totalPoints: number
    id:String

    constructor(document: FirebaseFirestore.QueryDocumentSnapshot){
        this.id = document.id;

        if( House.COLOR in document.data()){
            this.color = document.data()[House.COLOR];
        }
        else{
            this.color = "";
        }
        
        if( House.NUMBER_OF_RESIDENTS in document.data()){
            this.numberOfResidents = document.data()[House.NUMBER_OF_RESIDENTS];
        }
        else{
            this.numberOfResidents = -1;
        }

        if( House.TOTAL_POINTS in document.data()){
            this.totalPoints = document.data()[House.TOTAL_POINTS];
        }
        else{
            this.totalPoints = -1;
        }
    }

}