export enum UserPermissionLevel {
    RESIDENT = 0,
    RHP = 1, //RAs
    PROFESSIONAL_STAFF = 2, //REA - REC
    FACULTY = 3, // FHP
    PRIVILEGED_RESIDENT = 4,    //Hall Club Residents - they can make QR codes
    EXTERNAL_ADVISOR = 5 // External Advisor Hall staff, other honors staff

}

export function getUserPermissionLevelAsString(permission:UserPermissionLevel): string{
    switch(permission){
        case UserPermissionLevel.RESIDENT:
            return "Resident"
        case UserPermissionLevel.RHP:
            return "RHP"
        case UserPermissionLevel.PROFESSIONAL_STAFF:
            return "Professional Staff"
        case UserPermissionLevel.FACULTY:
            return "House Advisor"
        case UserPermissionLevel.PRIVILEGED_RESIDENT:
            return "Privileged Resident"
        case UserPermissionLevel.EXTERNAL_ADVISOR:
            return "External Advisor to the competition"
    }
}