import 'package:firebase/firebase.dart' as fb;

import 'package:meta/meta.dart';

class Reward{

  static const String API_NAME_KEY = "name";
  static const String API_REQUIRED_PPR_KEY = "requiredPPR";
  static const String API_DOWNLOAD_KEY = "downloadURL";

  String name;
//  String fileName;
  double requiredPPR;
  String rewardDownloadURL = "";

  Reward({@required this.name,@required this.requiredPPR, @required this.rewardDownloadURL});
//  {
//    fb.storage().ref(this.fileName).getDownloadURL().then((value) => rewardDownloadURL = value);
//  }

//  Future<Uri> getDownloadURL(){
//    if(this.rewardDownloadURL == null){
//      return Future.delayed(Duration(milliseconds: 100)).then((val)=> getDownloadURL());
//    }
//    else{
//      return Future.value(rewardDownloadURL);
//    }
//  }

  factory Reward.fromJson(Map<String,dynamic> json) {
    return Reward(
      name: json[API_NAME_KEY],
      requiredPPR : json[API_REQUIRED_PPR_KEY],
      rewardDownloadURL:  json[API_DOWNLOAD_KEY]
    );
  }

}
