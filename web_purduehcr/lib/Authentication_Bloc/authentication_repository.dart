import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/WebInitializationResponse.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';

class AuthenticationRepository {
  final Config config;

  AuthenticationRepository(this.config);

  Future<void> logout(){
    return FirebaseUtility.logout();
  }

  Future<SystemPreference> getSystemPreferences() async {
  Map<String, dynamic> settingsMap = await callCloudFunction(config, Method.GET, "competition/settings");
  return SystemPreference.fromJson(settingsMap["settings"]);
}

  Future<WebInitializationResponse> getInitializationData() async {
    Map<String, dynamic> initMap = await callCloudFunction(config, Method.GET, "web/initialization");
    return WebInitializationResponse.fromJson(initMap);
  }
}