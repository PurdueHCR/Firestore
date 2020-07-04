import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class RewardsCard extends StatefulWidget{
  final Reward reward;
  final House house;

  const RewardsCard({Key key, this.reward, this.house}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return RewardsCardState();
  }
}

class RewardsCardState extends State<RewardsCard>{
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Row(
        children: [
          FutureBuilder(
            future: widget.reward.getDownloadURL(),
            builder: (context, snapshot){
              if(snapshot.connectionState == ConnectionState.done){
                return Image(
                  image: NetworkImage(snapshot.data.toString()),
                );
              }
              else{
                return LoadingWidget();
              }
            },
          )
        ],
      ),
    );
  }
}