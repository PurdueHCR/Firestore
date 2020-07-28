import 'dart:ui';

import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/UserScore.dart';

class House{

  static const COLOR_KEY = "color";
  static const NUMBER_RESIDENTS_KEY = "numberOfResidents";
  static const TOTAL_POINTS_KEY = "totalPoints";
  static const ID_KEY = "id";
  static const POINTS_PER_RESIDENTS_KEY = "pointsPerResident";
  static const DOWNLOAD_URL = "downloadURL";
  static const YEAR_RANK = "yearRank";
  static const SEMESTER_RANK = "semesterRank";


  String name;
  double pointsPerResident;
  String color;
  int numberOfResidents;
  int totalPoints;
  String downloadURL;
  List<UserScore> overallScores;
  List<UserScore> semesterScores;

  House({@required this.name, @required this.pointsPerResident,
    @required this.color, @required this.numberOfResidents,
    @required this.totalPoints, @required this.downloadURL,
    this.overallScores, this.semesterScores});


  factory House.fromJson(Map<String, dynamic> json){

    List<UserScore> yearScores = new List();
    List<UserScore> semesterScores = new List();

    if(json.containsKey(YEAR_RANK)){
      Set<Map<String, dynamic>> yearRankList = Set.from(json[YEAR_RANK]);

      yearRankList.forEach((element) {
        yearScores.add(UserScore.fromJson(element));
      });
    }


    if(json.containsKey(SEMESTER_RANK)){
      Set<Map<String, dynamic>> semesterRankList = Set.from(json[SEMESTER_RANK]);

      semesterRankList.forEach((element) {
        semesterScores.add(UserScore.fromJson(element));
      });
    }

    return House(
      name: json[ID_KEY],
      pointsPerResident: json[POINTS_PER_RESIDENTS_KEY],
      color: json[COLOR_KEY],
      numberOfResidents: (json[NUMBER_RESIDENTS_KEY] != null )?json[NUMBER_RESIDENTS_KEY]: -1,
      totalPoints: (json[TOTAL_POINTS_KEY] != null )?json[TOTAL_POINTS_KEY]: -1,
      downloadURL: json[DOWNLOAD_URL],
      overallScores: yearScores,
      semesterScores: semesterScores
    );
  }


  Color getHouseColor(){
    final buffer = StringBuffer();
    if (this.color.length == 6 || this.color.length == 7) buffer.write('ff');
    buffer.write(this.color.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));

  }
}