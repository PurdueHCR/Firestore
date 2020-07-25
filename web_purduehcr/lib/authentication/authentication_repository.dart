import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';

class AuthenticationRepository {
  final Config config;

  AuthenticationRepository(this.config);


  Future<String> createUser(String first, String last, String code) {
    // TODO: implement createUser
    throw UnimplementedError();
  }

  Future<void> logout(){
    return FirebaseUtility.logout();
  }

  Future<User> getUser() async {
    Map<String, dynamic> userMap = await callCloudFunction(config, Method.GET, "user/");
    return User.fromJson(userMap);
  }
}