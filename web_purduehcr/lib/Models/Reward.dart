import 'package:firebase/firebase.dart' as fb;

import 'package:meta/meta.dart';

class Reward{

  static const String ID = "id";
  static const String NAME = "name";
  static const String REQUIRED_PPR = "requiredPPR";
  static const String DOWNLOAD_RUL = "downloadURL";
  static const String FILE_NAMe = "fileName";

  String name;
  String fileName;
  double requiredPPR;
  String downloadURL = "";
  String id;

  Reward({@required this.name,@required this.requiredPPR, @required this.downloadURL, this.fileName, this.id});


  factory Reward.fromJson(Map<String,dynamic> json) {
    return Reward(
      id: json[ID],
      name: json[NAME],
      requiredPPR : json[REQUIRED_PPR],
      downloadURL:  json[DOWNLOAD_RUL],
      fileName: json[FILE_NAMe]
    );
  }

}
