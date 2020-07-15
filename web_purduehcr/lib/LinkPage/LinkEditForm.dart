import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';
import 'package:qr_flutter/qr_flutter.dart';

class LinkEditForm extends StatefulWidget{

  final Link link;
  final Function(Link link) onUpdate;

  const LinkEditForm({Key key, this.link, this.onUpdate});

  @override
  State<StatefulWidget> createState() {
    return _LinkEditFormState();
  }

}

class _LinkEditFormState extends State<LinkEditForm>{
  bool isLoading = false;
  bool hasChanges = false;
  bool isChangingText = false;
  TextEditingController descriptionController ;
  @override
  Widget build(BuildContext context) {
    if(widget.link == null){
      return Text("Select a Link");
    }else if(isLoading){
      return LoadingWidget();
    }
    else{
      return SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  QrImage(
                    data: widget.link.dynamicLink,
                    version: QrVersions.auto,
                    size: 200.0,
                  ),
                ],
              ),
              Text(
                "Description",
                style: TextStyle(fontWeight: FontWeight.bold)
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                child: this.isChangingText ?
                TextField(
                  controller: descriptionController,
                  maxLines: null,
                  maxLength: 250,
                ) :
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Text(widget.link.description),
                    IconButton(
                      icon: Icon(Icons.edit),
                      onPressed: (){
                        setState(() {
                          descriptionController = TextEditingController(text: widget.link.description);
                          hasChanges = true;
                          isChangingText = true;
                        });
                      },
                    )
                  ],
                )
              ),
              Text("Point Type",
                style: TextStyle(fontWeight: FontWeight.bold)
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 4, 0, 0),
                child: PointTypeComponentsListTile(name: widget.link.pointTypeName, description: widget.link.pointTypeDescription, points: widget.link.pointTypeValue)
              ),
              Container(
                padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                child: Text('Options', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              SwitchListTile(
                  title: const Text('Single Use'),
                  value: widget.link.singleUse,
                  onChanged: (bool val) =>
                      setState(() {
                        widget.link.singleUse = val;
                        hasChanges = true;
                      }
                    )
              ),
              SwitchListTile(
                  title: const Text('Enabled'),
                  value: widget.link.enabled,
                  onChanged: (bool val) =>
                      setState(() {
                        widget.link.enabled = val;
                        hasChanges = true;
                      })
              ),
              SwitchListTile(
                  title: const Text('Archived'),
                  value: widget.link.archived,
                  onChanged: (bool val) =>
                      setState((){
                        widget.link.archived = val;
                        hasChanges = true;
                      })
              ),
              Container(
                padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                child: Text('Actions', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              Container(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: OutlineButton(
                  child: Text("Copy Link"),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: widget.link.dynamicLink));
                    final snackBar = SnackBar(
                      content: Text('Copied link to clipboard'),
                    );
                    Scaffold.of(context).showSnackBar(snackBar);
                  },
                ),
              ),
              Container(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: Visibility(
                  visible: hasChanges,
                  child: RaisedButton(
                    child: Text("Save Changes"),
                    onPressed: (){
                      setState(() {
                        if(descriptionController.text.isEmpty){
                          final snackBar = SnackBar(
                            backgroundColor: Colors.red,
                            content: Text('Can not have empty description'),
                          );
                          Scaffold.of(context).showSnackBar(snackBar);
                          hasChanges = false;
                          isChangingText = false;
                        }
                        else{
                          widget.link.description = descriptionController.text;
                          widget.onUpdate(widget.link);
                          hasChanges = false;
                          isChangingText = false;
                        }
                      });
                    },
                  ),
                ),
              )
            ],
          ),
        ),
      );
    }
  }

}