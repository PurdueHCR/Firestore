import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/OverviewPage/ResidentOverviewWidget.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

import 'overview_bloc/overview.dart';


class HomePage extends BasePage {
  const HomePage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return HomePageState(drawerLabel: "Overview");
  }
}

class HomePageState extends BasePageState {

  OverviewBloc _overviewBloc;

  HomePageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  void initState() {
    super.initState();
    _overviewBloc = new OverviewBloc();
    _overviewBloc.add(OverviewLaunchedEvent(permissionLevel: auth.user.permissionLevel, token: auth.token));
  }

  @override
  Widget buildDesktopBody() {
    return _buildBody();
  }

  @override
  Widget buildMobileBody() {
    return _buildBody();
  }

    Widget _buildBody(){
      return BlocProvider<OverviewBloc>(
        builder: (context) => _overviewBloc,
        child:BlocBuilder<OverviewBloc, OverviewState>(
          bloc: _overviewBloc,
          builder: (context, state) {
            if(state is ResidentOverviewLoaded){
              return Center(
                child: ResidentOverview(),
              );
            }
            else if(state is OverviewError){
              return Center(
                child: Column(
                  children: [
                    Text("ERROR: "+state.error.toString()),
                  ],
                ),
              );
            }
            else{
              return Center(child:LoadingWidget());
            }
          },
        ),
      );
    }

  @override
  void dispose() {
    _overviewBloc.close();
    super.dispose();
  }

}

