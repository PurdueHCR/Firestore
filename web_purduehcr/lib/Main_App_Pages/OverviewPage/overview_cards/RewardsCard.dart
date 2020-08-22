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
    if(widget.reward == null){
      return SizedBox.shrink();
    }
    else{
      return Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                drawRewardWidget(),
                drawTextWidgets()
              ],
            ),
          )
      );
    }
  }

  Widget drawRewardWidget(){
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        width: 100,
        height: 100,
        child: AspectRatio(
          aspectRatio: 1,
          child: Stack(
            children: [
              Positioned.fill(
                child: new CircularProgressIndicator(
                  strokeWidth: 10,
                  valueColor: new AlwaysStoppedAnimation<Color>(widget.house.getHouseColor()),
                  value: widget.house.pointsPerResident/ widget.reward.requiredPPR,
                ),
              ),
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Image.network(widget.reward.downloadURL)
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  Widget drawTextWidgets(){
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      mainAxisSize: MainAxisSize.max,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 0, 0, 8),
          child: Column(
            children: [
              Text("Next Reward"),
              Text(widget.reward.name),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
          child: Column(
            children: [
              Text(widget.house.pointsPerResident.toStringAsFixed(2)+ " / "+widget.reward.requiredPPR.toString()),
              Text("Points Per Resident", maxLines: null,),
            ],
          ),
        )
      ],
    );
  }
}