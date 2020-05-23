import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';


class UserRepository {

  final Config config;

  UserRepository(this.config);


  Future<String> createUser(String first, String last, String code) {
    // TODO: implement createUser
    throw UnimplementedError();
  }

  Future<String> createUserAccount(String username, String password) {
    // TODO: implement createUserAccount
    throw UnimplementedError();
  }

  Future loginUser(String email, String password) {
    return FirebaseUtility.signIn(config, email, password);
  }

  Future<void> logout(){
    return FirebaseUtility.logout();
  }

  Future<User> getUser() async {
    Map<String, dynamic> userMap = await callCloudFunction(config, Method.GET, "user/get");
    return User.fromJson(userMap);
  }

}