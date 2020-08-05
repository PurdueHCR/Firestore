import 'dart:math';

import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PhcrDrawer.dart';
import 'package:purduehcr_web/authentication/authentication.dart';



abstract class BasePage extends StatefulWidget {
  const BasePage({Key key}) : super(key: key);

}

abstract class BasePageState<B extends Bloc<E, S>,E, S> extends State<BasePage> {
  // ignore: close_sinks
  AuthenticationBloc authenticationBloc;
  Authenticated authState;
  final String drawerLabel;

  BasePageState(this.drawerLabel);

  @override
  void initState() {
    super.initState();
    //Because the bloc is not created here, it is merely retrieved, we can do this in the init state method
    authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    authState = authenticationBloc.state;
    WidgetsBinding.instance
        .addPostFrameCallback((_){
      if(!getAcceptedPermissionLevels().contains(authState.user.permissionLevel)){
        Navigator.of(context).pushReplacementNamed("/");
      }
    });

  }


  @override
  Widget build(BuildContext context) {
    switch (displayTypeOf(context)){
      case DisplayType.desktop_large:
        Widget child;
        if(getBloc() == null){
          child = Container(
            color: Theme.of(context).backgroundColor,
            child: Center(
              child: SizedBox(
                  width: getActiveAreaWidth(context) - 32,
                  child: Center(child: buildLargeDesktopBody())
              ),
            ),
          );
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return SafeArea(
                  child: Container(
                    color: Theme.of(context).backgroundColor,
                    child: Center(
                      child: SizedBox(
                        width: getActiveAreaWidth(context) - 32,
                        child: buildLargeDesktopBody(context: context, state:state)
                      ),
                    ),
                  ),
                );
              }
            },
          );
        }
        return Scaffold(
            floatingActionButton: buildFloatingActionButton(context),
            body: Row(
              children: [
                PhcrDrawer(this.drawerLabel),
                Expanded(
                  child: Column(
                    children: [
                      AppBar(
                        title: Text("Purdue HCR"),
                        automaticallyImplyLeading: false,
                        leading: buildLeadingButton(DisplayType.desktop_large),
                        actions: buildActions(DisplayType.desktop_large),
                      ),
                      Expanded(
                          child: child
                      ),
                    ],
                  ),
                )
              ],
            )
        );
        break;
      case DisplayType.desktop_small:
        Widget child;
        if(getBloc() == null){
          child = Padding(
            padding: const EdgeInsets.all(16.0),
            child: buildSmallDesktopBody(),
          );
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: buildSmallDesktopBody(context: context, state:state),
                );
              }
            },
          );
        }
        return Scaffold(
            floatingActionButton: buildFloatingActionButton(context),
            body: Row(
              children: [
                PhcrDrawer(this.drawerLabel),
                Expanded(
                  child: Column(
                    children: [
                      AppBar(
                        title: Text("Purdue HCR"),
                        automaticallyImplyLeading: false,
                        leading: buildLeadingButton(DisplayType.desktop_small),
                        actions: buildActions(DisplayType.desktop_small),
                      ),
                      Expanded(
                          child: child
                      ),
                    ],
                  ),
                )
              ],
            )
        );
        break;
      default:
        Widget child;
        if(getBloc() == null){
          child = Padding(
            padding: const EdgeInsets.all(16.0),
            child: buildMobileBody(),
          );
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: buildMobileBody(context: context, state:state),
                );
              }
            },
          );
        }
        return Scaffold(
            appBar: AppBar(
              title: Text("Purdue HCR"),
              leading: buildLeadingButton(DisplayType.mobile),
              actions: buildActions(DisplayType.mobile),
            ),
            drawer: PhcrDrawer(this.drawerLabel),
            body: child,
            floatingActionButton: buildFloatingActionButton(context),
        );
        break;
    }
  }

  B getBloc();
  Widget buildLargeDesktopBody({BuildContext context, S state});
  Widget buildSmallDesktopBody({BuildContext context, S state});
  Widget buildMobileBody({BuildContext context, S state});
  bool isLoadingState(S currentState);

  /// Returns a list of UserPermissionLevels which are allowed
  /// to access this page. If the user does not have one
  /// of these permissions, they will be redirected to the
  /// overview page.
  UserPermissionSet getAcceptedPermissionLevels();

  FloatingActionButton buildFloatingActionButton(BuildContext context){
    return null;
  }

  double getActiveAreaWidth(BuildContext context){
    switch(displayTypeOf(context)){
      case DisplayType.desktop_large:
      case DisplayType.desktop_small:
        return min(MediaQuery.of(context).size.width - 300, 1000);
      default:
        return MediaQuery.of(context).size.width;
    }
  }

  /// Returns the optimal width for a dialog that consists of
  /// a complex task. For notification dialogs, use the default
  /// size provided in the dialog builder.
  double getOptimalDialogWidth(BuildContext context){
    switch(displayTypeOf(context)){
      case DisplayType.desktop_large:
        return min((MediaQuery.of(context).size.width - 300) * 0.5, 400);
      case DisplayType.desktop_small:
        return min(MediaQuery.of(context).size.width - 300, 400) ;
      default:
        return MediaQuery.of(context).size.width;
    }
  }
  
  Widget buildLeadingButton(DisplayType displayType){
    return null;
  }

  List<Widget> buildActions(DisplayType displayType){
    return null;
  }

}

class UnimplementedPage extends BasePage{
  final String drawerLabel;
  UnimplementedPage({@required this.drawerLabel});

  @override
  State<StatefulWidget> createState() {
    return UnimplementedPageState(drawerLabel);
  }
}

class UnimplementedPageState extends BasePageState{

  UnimplementedPageState(String drawerLabel) : super(drawerLabel);

  @override
  Widget buildLargeDesktopBody({BuildContext context, state}) {
    return Center(child: Text("Unimplemented"));
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, state}) {
    return Center(child: Text("Unimplemented"));
  }

  @override
  Widget buildMobileBody({BuildContext context, state}) {
    return Center(child: Text("Unimplemented"));
  }

  @override
  bool isLoadingState(currentState) {
    return false;
  }

  @override
  Bloc getBloc() {
    return null;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return AllPermissionsSet();
  }

}