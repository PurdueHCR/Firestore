export const enum UserPermissionLevel {
    RESIDENT = 0,
    RHP = 1, //RAs
    PROFESSIONAL_STAFF = 2, //REA - REC
    FACULTY = 3, // FHP
    PRIVILEGED_RESIDENT = 4,    //Hall Club Residents - they can make QR codes
    EXTERNAL_ADVISOR = 5 // External Advisor Hall staff, other honors staff
}