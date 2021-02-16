import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'package:purduehcr_web/Models/User.dart';

class WebInitializationResponse {
  static const String USER_KEY = "user";
  static const String SETTINGS_KEY = "settings";
  static const String HOUSE_KEY = "house";


  User user;
  SystemPreference settings;
  House house;
  List<House> houses;

  WebInitializationResponse({this.user, this.settings, this.house, this.houses});

  factory WebInitializationResponse.fromJson(Map<String, dynamic> json){
    House house;
    if(json.containsKey(HOUSE_KEY)){
      house = House.fromJson(json[HOUSE_KEY]);
    }

    List<House> houses = new List();
    if(json["houses"] != null){
      Set<Map<String, dynamic>> houseList = Set.from(json["houses"]);
      houseList.forEach((element) {
        houses.add(House.fromJson(element));
      });
    }


    return WebInitializationResponse(
      user: User.fromJson(json[USER_KEY]),
      settings: SystemPreference.fromJson(json[SETTINGS_KEY]),
      house: house,
      houses: houses
    );
  }
}