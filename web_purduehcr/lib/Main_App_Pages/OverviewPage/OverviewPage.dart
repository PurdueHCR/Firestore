
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/ProfessionalStaffOverviewPage.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/RHPOverviewPage.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/ResidentOverviewPage.dart';

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
        return ProfessionalStaffOverviewPage();
      case UserPermissionLevel.FHP:
      case UserPermissionLevel.EXTERNAL_ADVISER:
      default:
        return UnimplementedPage(drawerLabel: "Overview");
    }
  }
}


