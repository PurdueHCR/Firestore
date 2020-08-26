import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';

class UserCreationRepository {

  final Config config;
  UserCreationRepository(this.config);

  Future<HouseCodePreview> getHouseInformationFromHouseCode(String houseCode) async {
    Map<String, dynamic> houseCodePreview = await callCloudFunction(config, Method.GET, "house_codes/preview?code="+houseCode);
    return HouseCodePreview.fromJson(houseCodePreview);
  }

  Future<User> joinHouse(String houseCode, String firstName, String lastName) async {
    Map<String, dynamic> body = {"code":houseCode, "first":firstName,"last":lastName};
    Map<String, dynamic> userMap = await callCloudFunction(config, Method.POST, "user/create",body: body );
    return User.fromJson(userMap);
  }

}

class HouseCodePreview {
  static const String HOUSE_CODE = "houseCode";
  static const String HOUSE = "house";

  HouseCode houseCode;
  House house;

  HouseCodePreview({this.houseCode, this.house});

  factory HouseCodePreview.fromJson(Map<String, dynamic> json){
    HouseCode code = HouseCode.fromJson(json[HOUSE_CODE]);
    House house;
    if(json.containsKey(HOUSE)){
      house = House.fromJson(json[HOUSE]);
    }

    return HouseCodePreview(
      house: house,
      houseCode: code
    );
  }

}