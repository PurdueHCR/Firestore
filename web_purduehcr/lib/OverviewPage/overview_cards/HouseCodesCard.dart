import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Utility_Views/HouseCodeList.dart';

class HouseCodesCard extends StatefulWidget{
  final List<HouseCode> houseCodes;

  const HouseCodesCard({Key key, this.houseCodes}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return _HouseCodeCardState();
  }
}

class _HouseCodeCardState extends State<HouseCodesCard>{
  @override
  Widget build(BuildContext context) {
    if(widget.houseCodes != null && widget.houseCodes.length > 0){
      return Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.max,
              children: [
                Text("House Codes",
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                      color: Colors.grey,
                      borderRadius: BorderRadius.all(Radius.circular(4))
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                    child: HouseCodeList(
                      shrinkWrap: true,
                      searchable: false,
                      houseCodes: widget.houseCodes,
                      onPressed: (context, code){
                        Clipboard.setData(ClipboardData(text: code.dynamicLink));
                        final snackBar = SnackBar(
                          content: Text('Copied Link to Join House'),
                        );
                        Scaffold.of(context).showSnackBar(snackBar);
                      },
                    ),
                  ),
                )
              ],
            ),
          )
      );
    }
    else{
      return Card(
        child: Text("There aren't any House Codes that you can see."),
      );
    }
  }
}