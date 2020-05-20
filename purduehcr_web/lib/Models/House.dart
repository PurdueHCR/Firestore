import 'package:firebase/firebase.dart' as fb;
import 'package:meta/meta.dart';

class House{

  static const COLOR_KEY = "color";
  static const NUMBER_RESIDENTS_KEY = "numberOfResidents";
  static const TOTAL_POINTS_KEY = "totalPoints";
  static const ID_KEY = "id";
  static const POINTS_PER_RESIDENTS_KEY = "pointsPerResident";

  String name;
  double pontsPerResident;
  String color;
  int numberOfResidents;
  int totalPoints;
  Uri downloadURL;

  House({@required this.name, @required this.pontsPerResident, @required this.color, @required this.numberOfResidents, @required this.totalPoints}){
    fb.storage().ref(this.name.toLowerCase()+".png").getDownloadURL().then((value) => downloadURL = value);
  }

  Future<Uri> getDownloadURL(){
    if(this.downloadURL == null){
      return Future.delayed(Duration(milliseconds: 100)).then((val)=> getDownloadURL());
    }
    else{
      return Future.value(downloadURL);
    }
  }

  factory House.fromJson(Map<String, dynamic> json){
    return House(
      name: json[ID_KEY],
      pontsPerResident: json[POINTS_PER_RESIDENTS_KEY],
      color: json[COLOR_KEY],
      numberOfResidents: (json[NUMBER_RESIDENTS_KEY] != null )?json[NUMBER_RESIDENTS_KEY]: -1,
      totalPoints: (json[TOTAL_POINTS_KEY] != null )?json[TOTAL_POINTS_KEY]: -1
    );
  }
}