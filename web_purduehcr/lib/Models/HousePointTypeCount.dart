class HousePointTypeCount {
  static const String NAME = "name";
  static const String APPROVED = "approved";
  static const String SUBMITTED = "submitted";


  String name;
  int approved;
  int submitted;

  HousePointTypeCount({this.name, this.approved, this.submitted});


  factory HousePointTypeCount.fromJson(Map<String,dynamic> json){
    return HousePointTypeCount(
      name: json[NAME],
      approved: json[APPROVED],
      submitted: json[SUBMITTED]
    );
  }

}