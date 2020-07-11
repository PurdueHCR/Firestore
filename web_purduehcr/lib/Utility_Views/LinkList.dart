import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

class LinkList extends StatefulWidget{
  final List<Link> links;
  final Function(BuildContext, Link) onPressed;
  final bool searchable;

  /// NOTE: This is not a linked list. This is a widget that shows a list of Link (QR Code) Models
  const LinkList({Key key, @required this.links, @required this.onPressed, this.searchable = true}):
        assert(links != null), assert(onPressed != null), super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LinkListState();
  }

}

class _LinkListState extends State<LinkList>{
  List<Link> visibleLinks;

  @override
  void initState() {
    super.initState();
    visibleLinks = widget.links;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleLinks.isEmpty){
      mainContent = Center(
        child: Text("No Links Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        itemCount: visibleLinks.length,
        itemBuilder: (BuildContext context, int index){
          return Card(child: LinkListTile(link: visibleLinks[index], onTap: widget.onPressed));
        },
      );
    }

    return Column(
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
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
        visibleLinks = widget.links;
      }
      else{
        visibleLinks = new List<Link>();
        for(Link link in widget.links){
          if(link.description.contains(value)){
            visibleLinks.add(link);
          }
        }
      }
    });

  }


}


class LinkListTile extends StatelessWidget{
  final Link link;
  final Function(BuildContext context, Link link) onTap;

  const LinkListTile({Key key, @required this.link, @required this.onTap}):
        assert(link != null), assert(onTap != null), super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => onTap(context, link),
      title: Text(link.description),
      subtitle: Text("${link.pointTypeName}"),
    );
  }

}