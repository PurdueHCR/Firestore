import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class HouseCodeRepository {

  final Config config;

  HouseCodeRepository(this.config);

  Future<List<HouseCode>> getHouseCodes() async {
    Map<String,dynamic> response = await callCloudFunction(config, Method.GET, "house_codes/");
    Set<Map<String, dynamic>> houseCodeList = Set.from(response["house_codes"]);
    List<HouseCode> houseCodes = new List();
    houseCodeList.forEach((code) {
      houseCodes.add(HouseCode.fromJson(code));
    });
    return houseCodes;
  }

  Future<List<HouseCode>> refreshHouseCodes() async {
    Map<String,dynamic> response = await callCloudFunction(config, Method.POST, "house_codes/refresh");
    Set<Map<String, dynamic>> houseCodeList = Set.from(response["house_codes"]);
    List<HouseCode> houseCodes = new List();
    houseCodeList.forEach((code) {
      houseCodes.add(HouseCode.fromJson(code));
    });
    return houseCodes;
  }

  refreshHouseCode(HouseCode code) async {
    Map<String,dynamic> response = await callCloudFunction(config, Method.POST, "house_codes/refresh", body: {"id":code.id});
    Set<Map<String, dynamic>> houseCodeList = Set.from(response["house_codes"]);
    List<HouseCode> houseCodes = new List();
    houseCodeList.forEach((houseCode) {
      houseCodes.add(HouseCode.fromJson(houseCode));
    });
    code.code = houseCodes[0].code;
  }

}