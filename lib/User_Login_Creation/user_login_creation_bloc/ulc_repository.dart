import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';

import '../../Utilities/HttpUtility.dart';

class UserRepository {

  Future<String> createUser(String first, String last, String code) {
    // TODO: implement createUser
    throw UnimplementedError();
  }

  Future<String> createUserAccount(String username, String password) {
    // TODO: implement createUserAccount
    throw UnimplementedError();
  }

  Future<String> loginUser(BuildContext context, String email, String password) {
    return FirebaseUtility.signIn(context, email, password);
  }

  Future<void> persistToken(String token) async {
    //TODO IMPLEMENT TOKEN CACHING
    /// write to keystore/keychain
    await Future.delayed(Duration(seconds: 1));
    return;
  }

  Future<bool> hasToken() async {
    //TODO IMPLEMENT TOKEN CACHING
    /// read from keystore/keychain
    await Future.delayed(Duration(seconds: 1));
    return false;
  }

  Future<String> getCachedToken() async {
    //TODO IMPLEMENT TOKEN CACHING
    return "FAKE TOKEN";
  }

  Future<void> logout(){
    return FirebaseUtility.logout().then((_) => _deleteToken());
  }

  Future<void> _deleteToken() {
    //TODO IMPLEMENT TOKEN CACHING
    return Future.delayed(Duration(seconds: 1));
  }

  Future<User> getUser(String token){
    return Network.get("user/get", token).then((userMap){
      return Future.value(User.fromJson(userMap));
    });

  }

}