enum UserPermissionLevel {
  RESIDENT,
  RHP,  //Resident Honors Preceptor (RA)
  PROFESSIONAL_STAFF,
  FHP,  //Faculty Honors Preceptor
  PRIVILEGED_RESIDENT,
  EXTERNAL_ADVISER // External Adviser to the competition
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
        return UserPermissionLevel.PRIVILEGED_RESIDENT;
      case 5:
        return  UserPermissionLevel.EXTERNAL_ADVISER;
      default:
        return UserPermissionLevel.RESIDENT;
    }
  }
  static String convertPermissionToString(UserPermissionLevel permissionLevel){
    switch(permissionLevel){
      case UserPermissionLevel.RESIDENT:
        return "Resident";
      case UserPermissionLevel.RHP:
        return "RHP";
      case UserPermissionLevel.PROFESSIONAL_STAFF:
        return "Professional Staff";
      case UserPermissionLevel.FHP:
        return "House Adviser";
      case UserPermissionLevel.PRIVILEGED_RESIDENT:
        return "Privileged Resident";
      case UserPermissionLevel.EXTERNAL_ADVISER:
        return "External Adviser";
    }
    return null;
  }
}

class UserPermissionSet{
  Set<UserPermissionLevel> permissionSet;
  UserPermissionSet(this.permissionSet);

  bool contains(UserPermissionLevel permissionLevel){
    return permissionSet.contains(permissionLevel);
  }
}

class ResidentialLifeStaffSet extends UserPermissionSet{
  ResidentialLifeStaffSet(): super([UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
}

class ActivityPlannerSet extends UserPermissionSet{
  ActivityPlannerSet(): super([UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.FHP, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.EXTERNAL_ADVISER].toSet());
}

class CompetitionParticipantsSet extends UserPermissionSet{
  CompetitionParticipantsSet(): super([UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PRIVILEGED_RESIDENT].toSet());
}

class AllPermissionsSet extends UserPermissionSet{
  AllPermissionsSet(): super([UserPermissionLevel.RESIDENT, UserPermissionLevel.RHP, UserPermissionLevel.PROFESSIONAL_STAFF, UserPermissionLevel.FHP, UserPermissionLevel.PRIVILEGED_RESIDENT, UserPermissionLevel.EXTERNAL_ADVISER].toSet());
}