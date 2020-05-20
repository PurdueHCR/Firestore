import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PhcrDrawer.dart';
import 'BLoCs/authentication/authentication.dart';


abstract class BasePage extends StatefulWidget {
  const BasePage({Key key}) : super(key: key);

}

abstract class BasePageState extends State<BasePage> {
  AuthenticationAuthenticated auth;
  final String drawerLabel;

  BasePageState({@required this.drawerLabel}):assert(drawerLabel != null);

  @override
  void initState() {
    auth = BlocProvider.of<AuthenticationBloc>(context).state;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final bool isDesktop = isDisplayDesktop(context);

    if(isDesktop) {
      return Scaffold(
          body: Row(
            children: [
              PhcrDrawer(this.drawerLabel),
              Expanded(
                child: Column(
                  children: [
                    AppBar(
                      title: Text("Purdue HCR"),
                      automaticallyImplyLeading: false,
                    ),
                    Expanded(
                      child: buildDesktopBody(),
                    ),
                  ],
                ),
              )
            ],
          )
      );
    }
    else{
      return Scaffold(
          appBar: AppBar(
            title: Text("Purdue HCR"),
            automaticallyImplyLeading: false,
          ),
          drawer: PhcrDrawer(this.drawerLabel),
          body: buildMobileBody()
      );
    }

  }
  Widget buildDesktopBody();
  Widget buildMobileBody();

}

