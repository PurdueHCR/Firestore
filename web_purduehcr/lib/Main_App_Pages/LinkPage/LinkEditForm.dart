import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Main_App_Pages/LinkPage/link_bloc/link.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';
import 'package:qr_flutter/qr_flutter.dart';

class LinkEditForm extends StatefulWidget{

  final Link link;
  final Function(Link link) onUpdate;

  const LinkEditForm({Key key, this.link, this.onUpdate}):super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _LinkEditFormState();
  }

}

class _LinkEditFormState extends State<LinkEditForm>{

  // because it is created in another file
  // ignore: close_sinks
  LinkBloc _linkBloc;
  bool isChangingText = false;
  TextEditingController descriptionController;
  bool isEnabled = false;
  bool isSingleUse = false;
  bool isArchived = false;
  String description = "";

  @override
  void initState() {
    super.initState();
    if(widget.link != null){
      isEnabled = widget.link.enabled;
      isSingleUse = widget.link.singleUse;
      isArchived = widget.link.archived;
      description = widget.link.description;
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_linkBloc == null){
      _linkBloc = BlocProvider.of<LinkBloc>(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    if(widget.link == null){
      return Center(
          child: Text("Select a Link")
      );
    }
    else {
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
                  maxLength: 250,
                  onEditingComplete: (){
                    FocusScope.of(context).unfocus();
                    setState(() {
                      isChangingText = false;
                      print("This should update to: "+descriptionController.text);
                      description = descriptionController.text;
                      _linkBloc.add(UpdateLink(link: widget.link, description:descriptionController.text));
                    });
                  },
                ) :
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Text(description),
                    IconButton(
                      icon: Icon(Icons.edit),
                      onPressed: (){
                        setState(() {
                          descriptionController = TextEditingController(text: widget.link.description);
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
                  value: isSingleUse,
                  onChanged: (bool val) =>
                      setState(() {
                        isSingleUse = val;
                        _linkBloc.add(UpdateLink(link: widget.link, singleUse: isSingleUse));
                      }
                    )
              ),
              SwitchListTile(
                  title: const Text('Enabled'),
                  value: isEnabled,
                  onChanged: (bool val) =>
                      setState(() {
                        isEnabled = val;
                        _linkBloc.add(UpdateLink(link: widget.link, enabled: isEnabled));
                      })
              ),
              SwitchListTile(
                  title: const Text('Archived'),
                  value: isArchived,
                  onChanged: (bool val) =>
                      setState((){
                        isArchived = val;
                        _linkBloc.add(UpdateLink(link: widget.link, archived: isArchived));
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
            ],
          ),
        ),
      );
    }
  }

}