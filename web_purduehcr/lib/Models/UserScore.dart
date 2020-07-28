/// User Score is the model that represents an entry in House/Details/Rank
/// which contains a copy of all users names and scores

class UserScore {
  static const String TOTAL_POINTS = "totalPoints";
  static const String SEMESTER_POINTS = "semesterPoints";
  static const String FIRST_NAME = "firstName";
  static const String LAST_NAME = "lastName";

  int totalPoints;
  int semesterPoints;
  String firstName;
  String lastName;

  UserScore({this.totalPoints, this.semesterPoints, this.firstName, this.lastName});

  factory UserScore.fromJson(Map<String, dynamic> json){
    return UserScore(
      totalPoints: json[TOTAL_POINTS],
      semesterPoints: json[SEMESTER_POINTS],
      firstName: json[FIRST_NAME],
      lastName: json[LAST_NAME]
    );
  }

}