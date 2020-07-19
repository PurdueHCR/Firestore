
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/authentication/authentication.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/OverviewPage/ResidentOverviewPage.dart';

class HomePage extends StatelessWidget {
  final String linkId;
  const HomePage({Key key, this.linkId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    User user = (BlocProvider.of<AuthenticationBloc>(context).state as Authenticated).user;
    switch(user.permissionLevel){
      case UserPermissionLevel.RESIDENT:
      case UserPermissionLevel.RHP:
      case UserPermissionLevel.PRIVILEGED_USER:
      return ResidentOverviewPage(linkId: linkId,);
      break;
      case UserPermissionLevel.PROFESSIONAL_STAFF:
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.NHAS:
      default:
        print("Unimplemented");
        return UnimplementedPage(drawerLabel: "Overview");
    }
  }
}


