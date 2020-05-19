import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/User.dart' as PHCRUser;
import 'package:purduehcr_web/Models/UserRank.dart';
import 'package:purduehcr_web/Utilities/HttpUtility.dart';

class APIUtility {


//  static Future<PHCRUser.User> getUser(String token){
//    return Network.get(domain+"user/get", token).then((userMap){
//      return Future.value(PHCRUser.User.fromJson(userMap));
//    });
//
//  }
//
//  static Future<UserRank> getUserRank(String token) {
//    return Network.get(domain+"user/auth-rank", token).then((rankJson) {
//      return Future.value(UserRank.fromJson(rankJson));
//    });
//  }
//
//  static Future<List<PointType>> getPointTypes(String token){
//    return Network.get(domain+"point_type/get", token).then((pointTypeList) {
//      Set<Map<String, dynamic>> tps = Set.from(pointTypeList);
//      List<PointType> types = new List();
//      tps.forEach((element) {
//        types.add(PointType.fromJson(element));
//      });
//      print("TYPES: "+types.toString());
//      return Future.value(types);
//    });
//  }
//
//  static Future<String> submitPoint(String token, String description, DateTime dateOccurred, String pointTypeId){
//    return Network.post(domain+"user/submitPoint", token, body: {"description": description, "date_occurred":dateOccurred.toString(), "point_type_id":pointTypeId})
//        .then((value) => value["message"]);
//  }
}