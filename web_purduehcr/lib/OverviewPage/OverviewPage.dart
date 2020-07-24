
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/OverviewPage/RHPOverviewPage.dart';
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
      case UserPermissionLevel.PRIVILEGED_RESIDENT:
      return ResidentOverviewPage(linkId: linkId,);
      case UserPermissionLevel.RHP:
        return RHPOverviewPage(linkId: linkId,);
      case UserPermissionLevel.PROFESSIONAL_STAFF:
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.EXTERNAL_ADVISER:
      default:
        print("Unimplemented");
        return UnimplementedPage(drawerLabel: "Overview");
    }
  }
}


