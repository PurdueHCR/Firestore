import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BLoCs/authentication/authentication.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/Models/User.dart';

class ResidentOverview extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _ResidentOverviewState();
  }

}

class _ResidentOverviewState extends State<ResidentOverview> {
  AuthenticationAuthenticated authState;
  ResidentOverviewLoaded residentData;
  User user;
  @override
  void initState() {
    super.initState();
     authState = BlocProvider.of<AuthenticationBloc>(context).state;
     residentData = BlocProvider.of<OverviewBloc>(context).state;
     user = authState.user;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: 150,
        width: 250,
        child: Card(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  Column(
                    children: <Widget>[
                      Container(
                        width: 100,
                        height: 100,
                        child: FutureBuilder(
                          future: user.getHouseDownloadURL(),
                          builder: (context, snapshot){
                            if(snapshot.connectionState == ConnectionState.none && !snapshot.hasData){
                              return Image.asset('assets/main_icon.png',
                                    height: 100,
                                    width: 100,);
                            }
                            else{
                              return Container(
                                width: 100,
                                height: 100,
                                child: Image.network((snapshot.data as Uri).toString()),
                              );
                            }
                          },
                        ),
                      ),
                      Text("Platinum - 4N")
                    ],
                  ),
                  Expanded(
                    child: Column(
                      children: <Widget>[
                        Text(user.firstName +" "+user.lastName),
                        Text(user.totalPoints.toString() + " Points")
                      ],
                    ),
                  )
                ],
              ),
              Text("#"+residentData.rank.houseRank.toString()+" Overall      #"+ residentData.rank.semesterRank.toString()+" Semester")
            ],
          ),
        )
    );
  }

}