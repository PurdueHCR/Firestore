import 'dart:html';

import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PhcrDrawer.dart';
import 'BLoCs/authentication/authentication.dart';


abstract class BasePage extends StatefulWidget {
  const BasePage({Key key}) : super(key: key);

}

abstract class BasePageState<B extends Bloc<E, S>,E, S> extends State<BasePage> {
  // ignore: close_sinks
  AuthenticationBloc authenticationBloc;
  Authenticated authState;
  final String drawerLabel;

  BasePageState({@required this.drawerLabel}):assert(drawerLabel != null);

  @override
  void initState() {
    authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    authState = authenticationBloc.state;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    switch (displayTypeOf(context)){

      case DisplayType.desktop_large:
        Widget child;
        if(getBloc() == null){
          child = buildLargeDesktopBody();
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return buildLargeDesktopBody();
              }
            },
          );
        }
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
          child = buildSmallDesktopBody();
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return buildSmallDesktopBody();
              }
            },
          );
        }
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
          child = buildMobileBody();
        }
        else{
          child = BlocBuilder<B,S>(
            bloc: getBloc(),
            builder: (BuildContext context, S state){
              if(isLoadingState(state)){
                return LoadingWidget();
              }
              else{
                return buildMobileBody();
              }
            },
          );
        }
        return Scaffold(
            appBar: AppBar(
              title: Text("Purdue HCR"),
            ),
            drawer: PhcrDrawer(this.drawerLabel),
            body: child
        );
        break;
    }
  }

  B getBloc();
  Widget buildLargeDesktopBody();
  Widget buildSmallDesktopBody();
  Widget buildMobileBody();
  bool isLoadingState(S currentState);

}

class UnimplementedPage extends BasePage{
  final String drawerLabel;
  UnimplementedPage({@required this.drawerLabel});

  @override
  State<StatefulWidget> createState() {
    return UnimplementedPageState(drawerLabel: drawerLabel);
  }
}

class UnimplementedPageState extends BasePageState{

  final String drawerLabel;
  UnimplementedPageState({@required this.drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  Widget buildLargeDesktopBody() {
    return Text("Unimplemented");
  }

  @override
  Widget buildSmallDesktopBody() {
    return Text("Unimplemented");
  }

  @override
  Widget buildMobileBody() {
    return Text("Unimplemented");
  }

  @override
  bool isLoadingState(currentState) {
    return false;
  }

  @override
  Bloc getBloc() {
    return null;
  }

}