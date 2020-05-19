enum PointTypePermissionLevel{
  PROFESSIONAL_STAFF_ONLY,
  PROFESSIONAL_AND_RHPS,
  ALL
}

class PointTypePermissionLevelConverter {
  static fromNum(int value){
    switch(value){
      case 1:
        return PointTypePermissionLevel.PROFESSIONAL_AND_RHPS;
      case 2:
        return PointTypePermissionLevel.ALL;
      default:
        return PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
    }
  }
}