import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

class PointTypeList extends StatefulWidget{
  final List<PointType> pointTypes;
  final Function(BuildContext, PointType) onPressed;
  final bool searchable;

  const PointTypeList({Key key, @required this.pointTypes, @required this.onPressed, this.searchable = true}):
        assert(pointTypes != null), assert(onPressed != null), super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PointTypeListState();
  }

}

class _PointTypeListState extends State<PointTypeList>{
  List<PointType> visibleTypes;

  @override
  void initState() {
    super.initState();
    visibleTypes = widget.pointTypes;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleTypes.isEmpty){
      mainContent = Center(
        child: Text("No Point Types Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        itemCount: visibleTypes.length,
        itemBuilder: (BuildContext context, int index){
          return Card(child: PointTypeListTile(pointType: visibleTypes[index], onTap: widget.onPressed));
        },
      );
    }

    return Column(
      children: [
        Visibility(
          visible: widget.searchable,
            child: Padding(
              padding: const EdgeInsets.all(4.0),
              child: SearchBar(onValueChanged: _onValueChanged),
            )
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
        visibleTypes = widget.pointTypes;
      }
      else{
        visibleTypes = new List<PointType>();
        for(PointType pt in widget.pointTypes){
          if(pt.name.contains(value) || pt.description.contains(value)){
            visibleTypes.add(pt);
          }
        }
      }
    });

  }


}


class PointTypeListTile extends StatelessWidget{
  final PointType pointType;
  final Function(BuildContext context, PointType pointType) onTap;

  const PointTypeListTile({Key key, @required this.pointType, @required this.onTap}):
        assert(pointType != null), assert(onTap != null), super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => onTap(context, pointType),
      title: Text(pointType.name),
      subtitle: Text(pointType.description),
      trailing: Column(
        children: [
          Text(pointType.value.toInt().toString()),
          Text("Points")
        ],
      ),
    );
  }
  
}

class PointTypeComponentsListTile extends StatelessWidget{
  final String name;
  final String description;
  final int points;

  const PointTypeComponentsListTile({Key key, @required this.name, @required this.description, @required this.points}):
        assert(name != null), assert(description != null), assert(points != null),  super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(name),
      subtitle: Text(description),
      trailing: Column(
        children: [
          Text(points.toString()),
          Text("Points")
        ],
      ),
    );
  }

}