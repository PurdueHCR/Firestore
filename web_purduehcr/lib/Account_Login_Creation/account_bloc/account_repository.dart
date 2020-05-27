import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/CloudFunctionUtility.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';


class AccountRepository {

  final Config config;

  AccountRepository(this.config);


  Future<String> createUserAccount(String username, String password) {
    // TODO: implement createUserAccount
    throw UnimplementedError();
  }

  Future loginUser(String email, String password) {
    return FirebaseUtility.signIn(config, email, password);
  }

}