import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/LinkPage/link_bloc/link.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

class LinkCreationForm extends StatefulWidget{

  final LinkBloc _linkBloc;
  final Function(String description,bool enabled, bool singleuse, int pointTypeId) onSubmit;

  LinkCreationForm(this._linkBloc, this.onSubmit);

  @override
  State<StatefulWidget> createState() {
    return _LinkCreationFormState();
  }

}

class _LinkCreationFormState extends State<LinkCreationForm>{
  final _formKey = GlobalKey<FormState>();
  PointType pointType;
  String description;
  bool singleUse = true;
  bool enabled = false;
  bool isLoading = false;

  TextEditingController _descriptionController = new TextEditingController();

  @override
  Widget build(BuildContext context) {
    if( isLoading){
      return LoadingWidget();
    }
    else{
      return Container(
          padding:
          const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
          child: Builder(
              builder: (context) => Form(
                  key: _formKey,
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        FormField(
                          builder: (FormFieldState<PointType> state ){
                            return Container(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 16.0, horizontal: 16.0),
                                child: OutlineButton(
                                    onPressed: () async {
                                      PointType pt = await showDialog<PointType>(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return AlertDialog(
                                              title: Text("Choose Point Type"),
                                              shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.all(Radius.circular(10.0))
                                              ),
                                              content: SingleChildScrollView(
                                                child: SizedBox(
                                                  width: 150,
                                                  height: 300,
                                                  child: FutureBuilder(
                                                      future: widget._linkBloc.getPointTypes(),
                                                      builder: ( context, snapshot) {
                                                        if(snapshot.connectionState == ConnectionState.done){
                                                          return PointTypeList(pointTypes: snapshot.data as List<PointType>, onPressed: (BuildContext context, PointType pt){
                                                            Navigator.pop(context, pt);
                                                          });
                                                        }
                                                        else{
                                                          return LoadingWidget();
                                                        }
                                                      }
                                                  ),
                                                ),
                                              ),
                                            );
                                          }
                                      );
                                      setState(() {
                                        state.didChange(pt);
                                        this.pointType = pt;
                                      });

                                    },
                                    child: Text(this.pointType != null ? this.pointType.name : 'Select a Point Type')
                                )
                            );
                          },
                          validator: (value){
                            if(value == null){
                              return 'Please select a point type.';
                            }
                            else{
                              return null;
                            }
                          },
                        ),
                        TextFormField(
                          decoration:
                          InputDecoration(labelText: 'Enter a description for this Link.'),
                          maxLines: null,
                          maxLength: 250,
                          controller: _descriptionController,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'Please enter a description';
                            }
                            return null;
                          },
                        ),
                        Container(
                          padding: const EdgeInsets.fromLTRB(0, 50, 0, 20),
                          child: Text('Options'),
                        ),
                        SwitchListTile(
                            title: const Text('Single Use'),
                            value: this.singleUse,
                            onChanged: (bool val) =>
                                setState(() => this.singleUse = val)
                        ),
                        SwitchListTile(
                            title: const Text('Enabled'),
                            value: this.enabled,
                            onChanged: (bool val) =>
                                setState(() => this.enabled = val)
                        ),
                        Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 16.0, horizontal: 16.0),
                            child: RaisedButton(
                                onPressed: () {
                                  final form = _formKey.currentState;
                                  if (form.validate()) {
                                    widget.onSubmit(_descriptionController.text,enabled,singleUse,pointType.id);
                                    setState(() {
                                      isLoading = true;
                                    });
                                  }
                                },
                                child: Text('Create')
                            )
                        ),
                      ]
                  )
              )
          )
      );
    }

  }

}