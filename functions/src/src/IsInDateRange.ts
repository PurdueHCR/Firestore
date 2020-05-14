
/**
 * Check that the supplied date is within the acceptable date range for the app. [August 1st - Now]
 * 
 * @param date 
 */
export function isInDateRange(date:Date): boolean {
    const date_max = new Date()
    
    let min_year = date_max.getFullYear()
    if(date_max.getMonth() < 7 ){
        min_year --;
    }

    const date_min = new Date(min_year, 7)
    console.log("Dates: "+date_min.toDateString()+" - "+date_max.toDateString())
    return date <= date_max && date >= date_min
}