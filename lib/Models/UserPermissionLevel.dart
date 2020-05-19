enum UserPermissionLevel {
  RESIDENT,
  RHP,  //Resident Honors Preceptor (RA)
  PROFESSIONAL_STAFF,
  FHP,  //Faculty Honors Preceptor
  PRIVILEGED_USER,
  NHAS, // Non Honors Affiliated Staff
}
class UserPermissionLevelConverter{
  static UserPermissionLevel fromNum(num value){
    switch(value){
      case 1:
        return UserPermissionLevel.RHP;
      case 2:
        return UserPermissionLevel.PROFESSIONAL_STAFF;
      case 3:
        return UserPermissionLevel.FHP;
      case 4:
        return UserPermissionLevel.PRIVILEGED_USER;
      case 5:
        return  UserPermissionLevel.NHAS;
      default:
        return UserPermissionLevel.RESIDENT;
    }
  }
}
