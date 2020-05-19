

class UserRank{

  static const String API_HOUSE_RANK = "houseRank";
  static const String API_SEMESTER_RANK = "semesterRank";


  num houseRank = -1;
  num semesterRank = -1;

  UserRank({this.houseRank, this.semesterRank});

  factory UserRank.fromJson(Map<String, dynamic> json){
    return UserRank(
        houseRank: json[API_HOUSE_RANK],
        semesterRank : json[API_SEMESTER_RANK]
    );
  }
}