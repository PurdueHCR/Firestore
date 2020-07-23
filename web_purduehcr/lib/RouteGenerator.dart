import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/ControlsPage/ControlsPage.dart';
import 'package:purduehcr_web/HandlePointsPage/HandlePointsPage.dart';
import 'package:purduehcr_web/HistoryPage/HistoryPage.dart';
import 'package:purduehcr_web/LinkPage/LinkPage.dart';
import 'package:purduehcr_web/Account_Login_Creation/CreateAccountPage.dart';
import 'package:purduehcr_web/Account_Login_Creation/JoinHousePage.dart';
import 'package:purduehcr_web/MyPointsPage/MyPointsPage.dart';
import 'package:purduehcr_web/OverviewPage/OverviewPage.dart';
import 'package:purduehcr_web/Account_Login_Creation/LogInPage.dart';
import 'package:purduehcr_web/SubmitPointsPage/SubmitPointsPage.dart';
import 'package:purduehcr_web/TokenTestPage/TokenTestPage.dart';

import 'package:purduehcr_web/authentication/authentication.dart';

import 'PointTypesPage/PointTypesPage.dart';

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    final args = settings.arguments;
    return PageRouteBuilder(pageBuilder: (context, animation1, animation2) {
      return BlocBuilder<AuthenticationBloc, AuthenticationState>(
          bloc: BlocProvider.of<AuthenticationBloc>(context),
          builder: (BuildContext context, AuthenticationState state) {
            if (state is Authenticated) {
              List<String> path = settings.name.split("/");
              switch (path[1]) {
                case '':
                  return HomePage();
                case 'token':
                  //If the user is on dev or test they can access TokenTestPage
                  return TokenTestPage();
                case 'submit_points':
                  return SubmitPointsPage();
                case 'handle_points':
                  return HandlePointsPage();
                case 'my_points':
                  return MyPointsPage();
                case 'links':
                  return LinkPage();
                case 'house_history':
                  return HistoryPage();
                case 'controls':
                  return ControlsPage();
                case 'point_type_controls':
                  return PointTypesControlPage();
                case 'addpoints':
                  if(path.length == 3){
                    return HomePage(linkId: path[2],);
                  }
                  else{
                    return HomePage();
                  }
                  break;
                default:
                  return _errorRoute();
              }
            }
            else if (state is AuthLoading) {
              return CircularProgressIndicator();
            }
            else if (state is AuthUninitialized) {
              return Center(
                child: Text("Initializing"),
              );
            }
            else {
              switch (settings.name){
                case '/create_account':
                  return CreateAccountPage();
                case '/create_user':
                  return JoinHousePage();
                default:
                  return LogInPage();
              }
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
