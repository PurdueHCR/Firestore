import 'package:flutter/material.dart';

class TopBanner extends StatefulWidget{

  final Color color;
  final String message;
  final List<Widget> actions;
  final bool showOnBottom;

  const TopBanner({Key key, this.color, this.message, this.actions, this.showOnBottom = true}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return _TopBannerState();
  }

}

class _TopBannerState extends State<TopBanner> {
  bool displayBanner = true;
  @override
  Widget build(BuildContext context) {
    if(displayBanner){
      return MaterialBanner(
        content: Text(widget.message),
        backgroundColor: widget.color,
        actions: (widget.actions == null || widget.actions.isEmpty)? _defaultActions(): widget.actions,
        forceActionsBelow: widget.showOnBottom,
      );
    }
    else{
      return SizedBox.shrink();
    }
  }

  List<Widget> _defaultActions(){
    return [
      FlatButton(
        child: Text("Dismiss"),
        onPressed: (){
          setState(() {
            displayBanner = false;
          });
        },
      )
    ];
  }

}