import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/handle_link_bloc/handle_link.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';


class SubmitLinkWidget extends StatefulWidget{
  final String linkId;

  const SubmitLinkWidget({Key key, this.linkId}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _SubmitLinkWidgetState();
  }

}

class _SubmitLinkWidgetState extends State<SubmitLinkWidget>{

  HandleLinkBloc _handleLinkBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_handleLinkBloc == null){
      Config config = ConfigWrapper.of(context);
      _handleLinkBloc = new HandleLinkBloc(config, BlocProvider.of<AuthenticationBloc>(context));
      _handleLinkBloc.add(HandleLinkInitialize(widget.linkId));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HandleLinkBloc, HandleLinkState>(
      bloc:_handleLinkBloc,
        builder: (BuildContext context, HandleLinkState state) {
        return AlertDialog(
          title: Text("Submit Point"),
          content: buildContent(context, state),
          actions: buildActions(context, state)
          );
        }
    );
  }

  List<Widget> buildActions(BuildContext context, HandleLinkState state){
    if(state is SubmitLinkForPointsSuccess){
      return [
        RaisedButton(
          child: Text("Great!"),
          onPressed: (){
            Navigator.of(context).pop(true);
          },
        ),
      ];
    }
    else if(state is HandleLinkError){
      return [
        RaisedButton(
          child: Text("Sad ..."),
          onPressed: (){
            Navigator.of(context).pop(false);
          },
        ),
      ];
    }
    else{
      return [
        FlatButton(
          child: Text("Close"),
          onPressed: (){
            Navigator.of(context).pop(false);
          },
        ),
        RaisedButton(
          child: Text("Submit"),
          onPressed: (){
            _handleLinkBloc.add(SubmitLinkForPoints(widget.linkId));
          },
        )
      ];
    }
  }

  Widget buildContent(BuildContext context, HandleLinkState state){
    if(state is HandleLinkLoading){
      return Container(
        width: 300,
        child: SizedBox(
          width: 100,
          height: 100,
          child: Center(
              child: LoadingWidget()
          ),
        ),
      );
    }
    else if(state is LinkLoaded){
      return Container(
        width: 300,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
              flex: 4,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(state.link.description,
                    textAlign: TextAlign.start,
                  ),
                  Text(state.link.pointTypeName,
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                    textAlign: TextAlign.start,
                  ),
                ],
              ),
            ),
            Flexible(
              flex: 1,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("${state.link.pointTypeValue}",),
                  Text((state.link.pointTypeValue == 1)? "point":"points")
                ],
              ),
            )
          ],
        ),
      );
    }
    else if(state is HandleLinkError){
      return Container(
          width: 300,
          child: Text(state.message)
      );
    }
    else if(state is SubmitLinkForPointsSuccess){
      return Container(
          width: 300,
          child: Text(state.message)
      );
    }
    else{
      return Container(
        width: 300,
        child: Text("Uh oh. Something has gone terribly wrong.")
      );
    }
  }
}