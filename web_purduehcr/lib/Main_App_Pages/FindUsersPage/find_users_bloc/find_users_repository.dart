import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';


class FindUsersRepository {

  final Config config;

  FindUsersRepository(this.config);

  ///Searches for users with the given name
  ///term is the letter or string to search for
  ///previousQueryLast is the last name from the last user in the previous search with the same term
  Future<List<User>> searchForUsersWithTerm(String term, {String previousQueryLast}) async {
    Map<String,dynamic> params = {"term":term};
    if(previousQueryLast != null){
      params["previousName"] = previousQueryLast;
    }
    Map<String,dynamic> userListJson = await callCloudFunction(config, Method.GET, "user/search", params: params);
    Set<Map<String, dynamic>> userJson = Set.from(userListJson["users"]);
    List<User> users = new List();
    userJson.forEach((element) {
      users.add(User.fromJson(element));
    });
    return users;
  }

  /// Update the user model. Only the Professional staff can fill all these fields. Check the API doc for more information
  updateUser(User user, { String first, String last, String house, String floorId, UserPermissionLevel permissionLevel, bool enabled}) async {
    Map<String, dynamic> body = Map();
    body["id"] = user.id;
    if(first != null){
      body[User.FIRST_NAME] = first;
    }
    if(last != null){
      body[User.LAST_NAME] = last;
    }
    if(house != null){
      body[User.HOUSE] = house;
    }
    if(floorId != null){
      body[User.FLOOR_ID] = floorId;
    }
    if(permissionLevel != null){
      body[User.PERMISSION_LEVEL] = permissionLevel.index;
    }
    if(enabled != null){
      body[User.ENABLED] = enabled;
    }
    await callCloudFunction(config, Method.PUT, "user/", body: body);
  }

  Future<List<HouseCode>> getHouseCodes() async {
    Map<String,dynamic> response = await callCloudFunction(config, Method.GET, "house_codes/");
    Set<Map<String, dynamic>> houseCodeList = Set.from(response["house_codes"]);
    List<HouseCode> houseCodes = new List();
    houseCodeList.forEach((code) {
      houseCodes.add(HouseCode.fromJson(code));
    });
    return houseCodes;
  }

}