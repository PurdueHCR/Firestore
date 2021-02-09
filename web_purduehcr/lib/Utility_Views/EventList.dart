import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/Event.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

import 'LoadingWidget.dart';

class EventList extends StatefulWidget{
  final List<Event> events;
  final Function(BuildContext, Event) onPressed;
  final bool searchable;

  const EventList({Key key, @required this.events, @required this.onPressed, this.searchable = true}):
        assert(events != null), assert(onPressed != null), super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _EventListState();
  }

}

class _EventListState extends State<EventList>{
  List<Event> visibleEvents;

  @override
  void initState() {
    super.initState();

    visibleEvents = widget.events != null ? widget.events : [];
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleEvents.isEmpty){
      mainContent = Center(
        child: Text("No Events Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        itemCount: visibleEvents.length,
        itemBuilder: (BuildContext context, int index){
          return Card(child: EventListTile(event: visibleEvents[index], onTap: widget.onPressed));
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
        visibleEvents = widget.events;
      }
      else{
        visibleEvents = new List<Event>();
        for(Event ev in widget.events){
          if(ev.name.contains(value)){
            visibleEvents.add(ev);
          }
        }
      }
    });
  }
}


class EventListTile extends StatelessWidget{
  final Event event;
  final Function(BuildContext context, Event event) onTap;

  const EventListTile({Key key, @required this.event, @required this.onTap}):
        assert(event != null), assert(onTap != null), super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => onTap(context, event),
      title: Text(event.name),
      trailing: Text(event.details)
    );
  }
}
