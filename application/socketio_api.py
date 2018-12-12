import flask_socketio

import application.events

SOCKETIO_APP = flask_socketio.SocketIO()


@SOCKETIO_APP.on('connect')
def connect_handler():
    SOCKETIO_APP.emit('connection', {'data': 'Connected'})


@SOCKETIO_APP.on('upcoming events')
def upcoming_events_handler():
    SOCKETIO_APP.emit('upcoming events', application.events.get_upcoming_events(
        application.events.PATH_TO_EVENTS_FILE))
