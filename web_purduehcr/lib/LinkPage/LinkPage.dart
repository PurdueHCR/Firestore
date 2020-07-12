
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/LinkPage/LinkCreationForm.dart';
import 'package:purduehcr_web/LinkPage/LinkEditForm.dart';
import 'package:purduehcr_web/LinkPage/link_bloc/link.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LinkList.dart';

import '../Config.dart';

class LinkPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _LinkPageState(drawerLabel: "Links");
  }

}

class _LinkPageState extends BasePageState<LinkBloc, LinkEvent, LinkState>{

  LinkBloc _linkBloc;
  Link _selectedLink;

  _LinkPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    Config config = ConfigWrapper.of(context);
    _linkBloc = new LinkBloc(config: config);
    _linkBloc.add(LinkInitialize());
  }

  @override
  Widget buildMobileBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return LinkList(
        links: _linkBloc.state.links,
        onPressed: _onPressed
    );
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return Row(
      children: [
        Flexible(
          child: LinkList(
              links: _linkBloc.state.links,
              onPressed: (BuildContext context, Link link){
                setState(() {
                  _selectedLink = link;
                });
              }
          ),
        ),
        VerticalDivider(),
        Flexible(
          child: LinkEditForm(
            key: UniqueKey(),
              link: _selectedLink,
              onUpdate: _onUpdate
          ),
        )
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, LinkState state}) {
    _onChangeState(context, state);
    return LinkList(
        links: _linkBloc.state.links,
        onPressed: _onPressed
    );
  }

  @override
  LinkBloc getBloc() {
    return _linkBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is LinkLoading;
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context){
    return FloatingActionButton(
      child: Icon(Icons.add),
      onPressed: () => _createLinkButton(context),
    );
  }

  _createLinkButton(BuildContext context){
    showDialog(
        context: context,
        builder: (BuildContext context){
          return SimpleDialog(
            title: Text("Create New Link"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))
            ),
            children: [
              SizedBox(
                width: 100,
                height: 450,
                child: LinkCreationForm(_linkBloc, _onCreate)
              )
            ],
          );
        }
    );
  }

  _onCreate(String description,bool enabled, bool singleuse, int pointTypeId){
    print("Create Link: $description, singleUse: ${singleuse.toString()}, ptid:${pointTypeId.toString()}, enabled: ${enabled.toString()}");
    _linkBloc.add(CreateLink(
        description: description,
        enabled: enabled,
        singleUse: singleuse,
        pointTypeId: pointTypeId,
        shouldDismissDialog: true));
  }

  _onUpdate(Link link){
    print("Updating Link!");
    _linkBloc.add(UpdateLink(link: link, shouldDismissDialog: displayTypeOf(context) != DisplayType.desktop_large));

  }

  _onPressed(BuildContext context, Link link){
    if(displayTypeOf(context) == DisplayType.desktop_large){
      setState(() {
        _selectedLink = link;
      });
    }
    else{
      showDialog(
          context: context,
          builder: (BuildContext context){
            return SimpleDialog(
              title: Text("Link Details"),
              children: [
                LinkEditForm(
                    key: UniqueKey(),
                    link: link,
                    onUpdate: _onUpdate
                ),
              ],
            );
          }
      );
    }
  }


  _onChangeState(BuildContext context, LinkState state){
    if(state is LinkSuccess){
      print("On change state success");
      print("Should dismiss ${state.shouldDismissDialog}");
      if(state.shouldDismissDialog){
        Navigator.pop(context);
      }
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text(state.message),
      );
      Scaffold.of(context).showSnackBar(snackBar);
      _linkBloc.add(LinkDisplayedMessage());
      _selectedLink = null;
    }
    else if(state is LinkError){
      print("On change state error");
      if(state.shouldDismissDialog){
        Navigator.pop(context);
      }
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content: Text('Could not create lnk'),
      );
      Scaffold.of(context).showSnackBar(snackBar);
      _linkBloc.add(LinkDisplayedMessage());
      _selectedLink = null;

    }
  }

}