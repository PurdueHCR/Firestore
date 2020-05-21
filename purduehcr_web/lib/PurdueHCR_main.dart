import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/RouteGenerator.dart';
import 'package:bloc/bloc.dart';

import 'package:purduehcr_web/BLoCs/authentication/authentication.dart';

import 'User_Login_Creation/user_login_creation_bloc/ulc_repository.dart';


class SimpleBlocDelegate extends BlocDelegate {
  @override
  void onTransition(Bloc bloc, Transition transition) {
    print(transition);
    super.onTransition(bloc, transition);
  }

}

class PurdueHCR extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    return PurdueHCRState();
  }
}

class PurdueHCRState extends State<PurdueHCR>{

  AuthenticationBloc _authenticationBloc;

  @override
  void initState() {
    _authenticationBloc = AuthenticationBloc(config: ConfigWrapper.of(context));
    _authenticationBloc.add(AppStarted());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<AuthenticationBloc>(
      builder: (context) => _authenticationBloc,
      child: MaterialApp(
        title: 'Purdue HCR',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        initialRoute: '/',
        onGenerateRoute: (settings) => RouteGenerator.generateRoute(settings),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _authenticationBloc.close();
  }
}