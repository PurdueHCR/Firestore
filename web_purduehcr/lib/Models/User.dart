import 'package:firebase/firebase.dart' as fb;
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

class User {

  static const String FIRST_NAME = "firstName";
  static const String FLOOR_ID ="floorId";
  static const String HOUSE = "house";
  static const String LAST_NAME = "lastName";
  static const String PERMISSION_LEVEL = "permissionLevel";
  static const String SEMESTER_POINTS = "semesterPoints";
  static const String TOTAL_POINTS = "totalPoints";
  static const String ENABLED = "enabled";

  String firstName = "";
  String lastName = "";
  String floorId = "";
  String house = "";
  num semesterPoints = 0;
  num totalPoints = 0;
  UserPermissionLevel permissionLevel = UserPermissionLevel.RESIDENT;
  String id = "";
  bool enabled = true;
  Uri houseDownloadURL;


  User(this.firstName,this.lastName,this.floorId,
      this.house,this.semesterPoints, this.totalPoints,this.permissionLevel, this.enabled,
      this.id){
    if(this.house != null && this.house.isNotEmpty){
      fb.storage().ref(this.house.toLowerCase()+".png").getDownloadURL().then((value) => houseDownloadURL = value);
    }
  }

  String getFullName(){
    return this.firstName + " " + this.lastName;
  }

  Future<Uri> getHouseDownloadURL(){
    if(this.houseDownloadURL == null){
      return Future.delayed(Duration(milliseconds: 100)).then((val)=> getHouseDownloadURL());
    }
    else{
      return Future.value(houseDownloadURL);
    }
  }

  bool isCompetitionParticipant(){
    return CompetitionParticipantsSet().contains(permissionLevel);
  }

  factory User.fromJson(Map<String, dynamic>  data){
    String id = data["id"];
    String firstName = data[FIRST_NAME];
    String lastName =  data[LAST_NAME];
    String floorId = data[FLOOR_ID];
    String house = data[HOUSE];
    int semesterPoints = data[SEMESTER_POINTS];
    int totalPoints = data[TOTAL_POINTS];
    bool enabled = data[ENABLED];
    UserPermissionLevel permissionLevel = UserPermissionLevelConverter.fromNum(data[PERMISSION_LEVEL]);
    return new User(firstName, lastName, floorId, house, semesterPoints, totalPoints, permissionLevel, enabled, id);
  }

  @override
  String toString() {
    // TODO: implement toString
    return "NAME: "+firstName+" "+lastName+" totalPoints: "+totalPoints.toString();
  }



}