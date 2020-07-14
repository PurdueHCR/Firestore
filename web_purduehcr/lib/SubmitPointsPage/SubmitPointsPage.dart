
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/SubmitPointsPage/PointSubmissionForm.dart';
import 'package:purduehcr_web/SubmitPointsPage/submit_points_bloc/submit_points.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PointTypeList.dart';

import '../Config.dart';

class SubmitPointsPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _SubmitPointsPageState(drawerLabel: "Submit Points");
  }

}

class _SubmitPointsPageState extends BasePageState<SubmitPointBloc, SubmitPointEvent, SubmitPointState>{

  SubmitPointBloc _submitPointBloc;
  PointType _selectedPointType;

  _SubmitPointsPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);



  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_submitPointBloc == null){
      Config config = ConfigWrapper.of(context);
      _submitPointBloc = new SubmitPointBloc(config);
      _submitPointBloc.add(SubmitPointInitialize());
    }
  }

  @override
  Widget buildMobileBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    return PointTypeList(
        pointTypes: _submitPointBloc.state.pointTypes,
        onPressed: _onPressed
    );
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: PointTypeList(
              pointTypes: _submitPointBloc.state.pointTypes,
              onPressed: _onPressed
          ),
        ),
        VerticalDivider(),
        Flexible(
            child: PointSubmissionForm(
              key: new ObjectKey(_selectedPointType),
              pointType: _selectedPointType,
              onSubmit: _onSubmit,
            )
        )
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, SubmitPointState state}) {
    _onChangeState(context, state);
    return PointTypeList(pointTypes: _submitPointBloc.state.pointTypes, onPressed: _onPressed);
  }

  @override
  SubmitPointBloc getBloc() {
    return _submitPointBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is SubmitPointPageLoading;
  }

  _onPressed(BuildContext context, PointType pointType){
    if(displayTypeOf(context) == DisplayType.desktop_large){
      setState(() {
        _selectedPointType = pointType;
      });
    }
    else{
      showDialog(
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Submission Form"),
            children: [
              PointSubmissionForm(
                key: new ObjectKey(_selectedPointType),
                pointType: pointType,
                onSubmit: _onSubmit,
              )
            ],
          );
        }
      );
    }
  }

  _onSubmit(String description,DateTime dateOccurred,int pointTypeId) async {
    print("Submit Point: $description, ${dateOccurred.toString()}, ${pointTypeId.toString()}");
    _submitPointBloc.add(SubmitPoint(
        description: description,
        dateOccurred: dateOccurred,
        pointTypeId: pointTypeId,
        shouldDismissDialog: displayTypeOf(context) != DisplayType.desktop_large));
  }

  _onChangeState(BuildContext context, SubmitPointState state){
    if(state is SubmissionSuccess){
      print("On change state success");
      if(state.shouldDismissDialog){
        Navigator.pop(context);
      }
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text('Submission Recorded'),
      );

      //This is not a good way to do this, but if you can find a better way to do this
      // and running in debug doesn't throw an error, please change it
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _selectedPointType = null;
        _submitPointBloc.add(SubmitPointDisplayedMessage());
      });
    }
    else if(state is SubmissionError){
      print("On change state error");
      if(state.shouldDismissDialog){
        Navigator.pop(context);
      }
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text('Could not record submission'),
      );

      //This is not a good way to do this, but if you can find a better way to do this
      // and running in debug doesn't throw an error, please change it
      Future.delayed(Duration(seconds: 1), (){
        Scaffold.of(context).showSnackBar(snackBar);
        _submitPointBloc.add(SubmitPointDisplayedMessage());
        _selectedPointType = null;
      });

    }
  }

}