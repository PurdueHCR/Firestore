import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

import 'LoadingWidget.dart';

class RewardList extends StatefulWidget{
  final List<Reward> rewards;
  final Function(BuildContext, Reward) onPressed;
  final bool searchable;

  const RewardList({Key key, @required this.rewards, @required this.onPressed, this.searchable = true}):
        assert(rewards != null), assert(onPressed != null), super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _RewardListState();
  }

}

class _RewardListState extends State<RewardList>{
  List<Reward> visibleRewards;

  @override
  void initState() {
    super.initState();
    visibleRewards = widget.rewards;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleRewards.isEmpty){
      mainContent = Center(
        child: Text("No Point Types Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        itemCount: visibleRewards.length,
        itemBuilder: (BuildContext context, int index){
          return Card(child: RewardListTile(reward: visibleRewards[index], onTap: widget.onPressed));
        },
      );
    }

    return Column(
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
        ),
        Expanded(
          child: mainContent,
        )
      ],
    );
  }
  _onValueChanged(String value){
    setState(() {
      if(value.isEmpty){
        visibleRewards = widget.rewards;
      }
      else{
        visibleRewards = new List<Reward>();
        for(Reward pt in widget.rewards){
          if(pt.name.contains(value)){
            visibleRewards.add(pt);
          }
        }
      }
    });
  }
}


class RewardListTile extends StatelessWidget{
  final Reward reward;
  final Function(BuildContext context, Reward reward) onTap;

  const RewardListTile({Key key, @required this.reward, @required this.onTap}):
        assert(reward != null), assert(onTap != null), super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => onTap(context, reward),
      title: Text(reward.name),
      trailing: Text("${reward.requiredPPR}"),
      leading: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Image.network(reward.rewardDownloadURL)
      ),
    );
  }
}
