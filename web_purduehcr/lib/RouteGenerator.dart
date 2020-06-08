import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/OverviewPage/OverviewPage.dart';
import 'package:purduehcr_web/Account_Login_Creation/LogInPage.dart';
import 'package:purduehcr_web/SubmitPointsPage/SubmitPointsPage.dart';
import 'package:purduehcr_web/TokenTestPage/TokenTestPage.dart';

import 'package:purduehcr_web/authentication/authentication.dart';

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    final args = settings.arguments;

    return PageRouteBuilder(pageBuilder: (context, animation1, animation2) {
      return BlocBuilder<AuthenticationBloc, AuthenticationState>(
          bloc: BlocProvider.of<AuthenticationBloc>(context),
          builder: (BuildContext context, AuthenticationState state) {
            if (state is Authenticated) {
              switch (settings.name) {
                case '/':
                  return HomePage();
                case '/token':
                  //If the user is on dev or test they can access TokenTestPage
                  return TokenTestPage();
                case '/submit_points':
                  return SubmitPointsPage();
                default:
                  return _errorRoute();
              }
            } else if (state is AuthLoading) {
              
              return CircularProgressIndicator();
            } else if (state is AuthUninitialized) {
              return Center(
                child: Text("Initializing"),
              );
            } else {
              return LogInPage();
            }
          });
    });
  }

  static Widget _errorRoute() {
    return Scaffold(
        appBar: AppBar(
          title: Text("Purdue HCR"),
        ),
        body: Center(child: Text('404 - Page not found')));
  }
}
