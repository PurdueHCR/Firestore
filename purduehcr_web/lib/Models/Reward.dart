import 'package:firebase/firebase.dart' as fb;

import 'package:meta/meta.dart';

class Reward{

  static const String API_NAME_KEY = "id";
  static const String API_REQUIRED_PPR_KEY = "requiredPPR";
  static const String API_PATH_KEY = "fileName";

  String name;
  String fileName;
  double requiredPPR;

  Reward({@required this.name,@required this.requiredPPR, @required this.fileName});

  Future<Uri> getDownloadURL(){
    return fb.storage().ref(this.fileName).getDownloadURL();
  }

  factory Reward.fromJson(Map<String,dynamic> json) {
    return Reward(
      name: json[API_NAME_KEY],
      requiredPPR : json[API_REQUIRED_PPR_KEY],
        fileName:  json[API_PATH_KEY]
    );
  }

}
