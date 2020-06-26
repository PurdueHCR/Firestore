import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';


class AccountRepository {

  final Config config;

  AccountRepository(this.config);


  Future createAccount(String email, String password) {
    return FirebaseUtility.createAccount(config, email, password);
  }

  Future loginUser(String email, String password) {
    return FirebaseUtility.signIn(config, email, password);
  }

}