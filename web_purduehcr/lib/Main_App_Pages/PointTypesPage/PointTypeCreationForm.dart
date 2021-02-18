import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/PointTypesPage/point_type_control_bloc/point_type_control.dart';
import 'package:purduehcr_web/Utility_Views/FormSection.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class PointTypeCreationForm extends StatefulWidget{

  PointTypeCreationForm();

  @override
  State<StatefulWidget> createState() {
    return _PointTypeCreationFormState();
  }

}

class _PointTypeCreationFormState extends State<PointTypeCreationForm>{

  TextEditingController descriptionController = TextEditingController();
  TextEditingController nameController = TextEditingController();
  TextEditingController valueController = TextEditingController();

  final _formKey = GlobalKey<FormState>();
  String name = "";
  String description = "";
  String value = "0";
  PointTypePermissionLevel permission = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
  bool isEnabled = true;
  bool residentsCanSubmit = true;
  bool isLoading = false;

  // ignore: close_sinks
  PointTypeControlBloc _pointTypeControlBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_pointTypeControlBloc == null){
      _pointTypeControlBloc = BlocProvider.of<PointTypeControlBloc>(context);
    }
  }


  @override
  Widget build(BuildContext context) {
    if( isLoading){
      return LoadingWidget();
    }
    else{
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8.0),
        child: Builder(
          builder: (context) => Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FormSection(
                  label: "Point Category Details",
                  children: [
                    TextFormField(
                      decoration:
                      InputDecoration(labelText: 'Enter a name for this point category.'),
                      maxLines: null,
                      maxLength: 100,
                      controller: nameController,
                      validator: (value) {
                        if (value.isEmpty) {
                          return 'Please enter a name for this point category.';
                        }
                        return null;
                      },
                    ),
                    TextFormField(
                      decoration:
                      InputDecoration(labelText: 'Enter a description for this point category.'),
                      maxLines: null,
                      maxLength: 400,
                      controller: descriptionController,
                      validator: (value) {
                        if (value.isEmpty) {
                          return 'Please enter a description for this point category.';
                        }
                        return null;
                      },
                    ),
                    TextFormField(
                      decoration:
                      InputDecoration(labelText: 'How many points is this worth?'),
                      maxLines: null,
                      maxLength: 4,
                      keyboardType: TextInputType.numberWithOptions(),
                      controller: valueController,
                      validator: (value) {
                        if (value.isEmpty) {
                          return 'Please enter how many points this is worth.';
                        }
                        var points = int.tryParse(value);
                        if(points == null){
                          return "Points must be an integer.";
                        }
                        if(points == 0){
                          return 'Please enter how many points this is worth.';
                        }
                        if(points < 0){
                          return 'Please enter a positive value.';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
                FormSection(
                  label: "Permissions and Controls",
                  children: [
                    FormField(
                      initialValue: PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY ,
                      builder: (FormFieldState<PointTypePermissionLevel> state){
                        return Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.fromLTRB(0, 16, 0, 8),
                              child: Text('Who is allowed to make this into a Link, QR code, or Event?', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                            (state.value == PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY)?
                            RaisedButton(
                              child: Text("Professional Staff Only"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY);
                                  permission = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
                                });
                              },
                            )
                                :
                            OutlineButton(
                              child: Text("Professional Staff Only"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY);
                                  permission = PointTypePermissionLevel.PROFESSIONAL_STAFF_ONLY;
                                });
                              },
                            ),
                            (state.value == PointTypePermissionLevel.PROFESSIONAL_AND_RHPS)?
                            RaisedButton(
                              child: Text("Residential Life Staff Only"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.PROFESSIONAL_AND_RHPS);
                                  permission = PointTypePermissionLevel.PROFESSIONAL_AND_RHPS;
                                });
                              },
                            )
                                :
                            OutlineButton(
                              child: Text("Residential Life Staff Only"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.PROFESSIONAL_AND_RHPS);
                                  permission = PointTypePermissionLevel.PROFESSIONAL_AND_RHPS;
                                });
                              },
                            ),
                            (state.value == PointTypePermissionLevel.ALL)?
                            RaisedButton(
                              child: Text("All Non Residents"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.ALL);
                                  permission = PointTypePermissionLevel.ALL;
                                });
                              },
                            )
                                :
                            OutlineButton(
                              child: Text("All Non Residents"),
                              onPressed: (){
                                setState(() {
                                  state.didChange(PointTypePermissionLevel.ALL);
                                  permission = PointTypePermissionLevel.ALL;
                                });
                              },
                            ),
                            Visibility(
                              visible: state.errorText != null && state.errorText.isNotEmpty,
                              child: Text(state.errorText != null? state.errorText: "", style: TextStyle(color: Color.fromARGB(255, 211, 47, 47), fontSize: 13),),
                            )
                          ],
                        );
                      },
                    ),
                    SwitchListTile(
                        title: const Text('Residents have to scan this through a QR Code, Link, or Event'),
                        value: !this.residentsCanSubmit,
                        onChanged: (bool val) =>
                            setState(() => this.residentsCanSubmit = !val)
                    ),
                    SwitchListTile(
                        title: const Text('Enabled'),
                        value: this.isEnabled,
                        onChanged: (bool val) =>
                            setState(() => this.isEnabled = val)
                    ),
                    Container(
                        padding: const EdgeInsets.symmetric(
                            vertical: 16.0, horizontal: 16.0),
                        child: RaisedButton(
                            onPressed: () {
                              final form = _formKey.currentState;
                              if (form.validate()) {
                                setState(() {
                                  isLoading = true;
                                  _pointTypeControlBloc.add(CreatePointType(isEnabled, residentsCanSubmit, int.parse(valueController.text), permission, descriptionController.text, nameController.text));
                                });
                              }
                            },
                            child: Text('Create')
                        )
                    ),
                  ],
                )
              ],
            ),
          )
        ),
      );
    }
  }

}