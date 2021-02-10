import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/User.dart' as PHCRUser;
import 'package:purduehcr_web/Models/UserRank.dart';
import 'package:purduehcr_web/Utilities/HttpUtility.dart';

class APIUtility {


  static void setBodyField(Map<String, dynamic> body, String key, dynamic value){
    if(value != null){
      body[key] = value;
    }
  }
}