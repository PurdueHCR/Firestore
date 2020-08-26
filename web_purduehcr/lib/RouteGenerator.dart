import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Utility_Views/InitializationPage.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/OverviewPage.dart';
import 'package:purduehcr_web/Account_And_User_Pages/Account_Login_Creation/AccountPage.dart';
import 'package:purduehcr_web/Main_App_Pages/ControlsPage/ControlsPage.dart';
import 'package:purduehcr_web/Main_App_Pages/FindUsersPage/FindUsersPage.dart';
import 'package:purduehcr_web/Main_App_Pages/HandlePointsPage/HandlePointsPage.dart';
import 'package:purduehcr_web/Main_App_Pages/HistoryPage/HistoryPage.dart';
import 'package:purduehcr_web/Main_App_Pages/HouseCodePage/HouseCodePage.dart';
import 'package:purduehcr_web/Main_App_Pages/LinkPage/LinkPage.dart';
import 'package:purduehcr_web/Main_App_Pages/MyPointsPage/MyPointsPage.dart';
import 'package:purduehcr_web/Main_App_Pages/PointTypesPage/PointTypesPage.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/RewardsPage.dart';
import 'package:purduehcr_web/Main_App_Pages/SubmitPointsPage/SubmitPointsPage.dart';
import 'package:purduehcr_web/Account_And_User_Pages/UserCreation/UserCreationPage.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    final args = settings.arguments;
    return PageRouteBuilder(pageBuilder: (context, animation1, animation2) {
      return BlocBuilder<AuthenticationBloc, AuthenticationState>(
          bloc: BlocProvider.of<AuthenticationBloc>(context),
          builder: (BuildContext context, AuthenticationState state) {
            List<String> path = settings.name.split("/");
            if (state is Authenticated) {
              switch (path[1]) {
                case '':
                  return HomePage();
//                case 'token':
//                  //If the user is on dev or test they can access TokenTestPage
//                  return TokenTestPage();
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
                case 'house_codes':
                  return HouseCodePage();
                case 'find_users':
                  return FindUsersPage();
                case 'rewards':
                  return RewardsPage();
                case 'createaccount':
                  return HomePage();
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
              return InitializationPage();
            }
            else if (state is AuthenticatedButNoUser) {
              if(path.length == 3){
                return UserCreationPage(houseCode: path[2]);
              }
              else{
                return UserCreationPage();
              }
            }
            else if(state is ConnectionErrorState) {
              return InitializationPage(
                message: "There was an error connecting to the server. Please refresh the page.",
                key: UniqueKey(),
              );
            }
            else if (state is Unauthenticated){
              if(path.length == 3){
                return AccountPage(houseCode: path[2]);
              }
              else{
                return AccountPage();
              }
            }
            else {
              return InitializationPage(
                  message: "There was an error with authentication. Please refresh the page.",
                  key: UniqueKey(),
              );
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
