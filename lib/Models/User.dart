import 'package:firebase/firebase.dart' as fb;
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

class User {

  static const String FIRST_NAME = "FirstName";
  static const String FLOOR_ID ="FloorID";
  static const String HOUSE = "House";
  static const String LAST_NAME = "LastName";
  static const String PERMISSION_LEVEL = "Permission Level";
  static const String SEMESTER_POINTS = "SemesterPoints";
  static const String TOTAL_POINTS = "TotalPoints";

  String firstName = "";
  String lastName = "";
  String floorId = "";
  String house = "";
  num semesterPoints = 0;
  num totalPoints = 0;
  UserPermissionLevel permissionLevel = UserPermissionLevel.RESIDENT;
  String id = "";
  Uri houseDownloadURL;


  User(this.firstName,this.lastName,this.floorId,
      this.house,this.semesterPoints, this.totalPoints,this.permissionLevel,
      this.id){
    fb.storage().ref(this.house.toLowerCase()+".png").getDownloadURL().then((value) => houseDownloadURL = value);
  }

  Future<Uri> getHouseDownloadURL(){
    if(this.houseDownloadURL == null){
      return Future.delayed(Duration(milliseconds: 100)).then((val)=> getHouseDownloadURL());
    }
    else{
      return Future.value(houseDownloadURL);
    }
  }

  factory User.fromJson(Map<String, dynamic>  data){
    String id = data["id"];
    String firstName = data[FIRST_NAME];
    String lastName =  data[LAST_NAME];
    String floorId = data[FLOOR_ID];
    String house = data[HOUSE];
    int semesterPoints = data[SEMESTER_POINTS];
    int totalPoints = data[TOTAL_POINTS];
    UserPermissionLevel permissionLevel = UserPermissionLevelConverter.fromNum(data[PERMISSION_LEVEL]);
    return new User(firstName, lastName, floorId, house, semesterPoints, totalPoints, permissionLevel, id);
  }

  @override
  String toString() {
    // TODO: implement toString
    return "NAME: "+firstName+" "+lastName+" totalPoints: "+totalPoints.toString();
  }



}