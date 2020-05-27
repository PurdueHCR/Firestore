import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/authentication/authentication.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RewardsCard.dart';

class ResidentOverview extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _ResidentOverviewState();
  }

}

class _ResidentOverviewState extends State<ResidentOverview> {
  Authenticated authState;
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
    return GridView.count(
      crossAxisCount: 2,
      children: [
        ProfileCard(
            user:user,
            userRank:residentData.rank
        ),
        RewardsCard(
          reward: residentData.reward,
          house: residentData.houses[0],
        )
      ],
    );
  }
}