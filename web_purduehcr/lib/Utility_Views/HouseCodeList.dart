import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

import 'LoadingWidget.dart';

class HouseCodeList extends StatefulWidget{
  final List<HouseCode> houseCodes;
  final Function(BuildContext, HouseCode) onPressed;
  final Function( HouseCode) onSwipe;
  final bool searchable;

  const HouseCodeList({Key key, @required this.houseCodes, @required this.onPressed, this.searchable = true, this.onSwipe}):super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HouseCodeListState();
  }

}

class _HouseCodeListState extends State<HouseCodeList>{
  List<HouseCode> visibleCodes;

  @override
  void initState() {
    super.initState();
    visibleCodes = widget.houseCodes;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleCodes.isEmpty){
      mainContent = Center(
        child: Text("No House Codes Found"),
      );
    }
    else{
      mainContent = ListView.builder(
//        shrinkWrap: true,
        itemCount: visibleCodes.length,
        itemBuilder: (BuildContext context, int index){
          return Card(
            child: HouseCodeListTile(houseCode: visibleCodes[index], onTap: widget.onPressed, onSwipe: widget.onSwipe,),
          );
        },
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
        ),
        Expanded(child: mainContent)
      ],
    );
  }
  _onValueChanged(String value){
    setState(() {
      if(value.isEmpty){
        visibleCodes = widget.houseCodes;
      }
      else{
        visibleCodes = new List<HouseCode>();
        for(HouseCode code in widget.houseCodes){
          if(code.codeName.contains(value)){
            visibleCodes.add(code);
          }
        }
      }
    });

  }
}


class HouseCodeListTile extends StatelessWidget{
  final HouseCode houseCode;
  final Function(BuildContext context, HouseCode houseCode) onTap;
  final Function(HouseCode houseCode) onSwipe;

  const HouseCodeListTile({Key key, @required this.houseCode, this.onTap, this.onSwipe}): super(key: key);

  @override
  Widget build(BuildContext context) {
    return Slidable(
      actionPane: SlidableDrawerActionPane(),
      actionExtentRatio: 0.25,
      child: ListTile(
          onTap: () => onTap(context, houseCode),
          title: Text(houseCode.codeName),
          trailing: (houseCode.code == null)?
          SizedBox(
              width: 40,
              height: 40,
              child: AspectRatio(
                  aspectRatio: 1,
                  child: LoadingWidget()
              )
          )
              :
          Text(houseCode.code)
      ),
      secondaryActions: <Widget>[

        IconSlideAction(
          caption: 'Refresh',
          color: Colors.yellow,
          icon: Icons.refresh,
          onTap: () => onSwipe(houseCode),
        ),
      ],
    );
  }

}
