import flask

import application.events

HTTP_API_BLUEPRINT = flask.Blueprint('http_api', __name__)


@HTTP_API_BLUEPRINT.route('/', methods=['GET'])
def index_handler():
    return flask.render_template('index.html')


@HTTP_API_BLUEPRINT.route('/all_events', methods=['GET'])
def all_events_handler():
    return flask.jsonify(application.events.get_all_events(
        application.events.PATH_TO_EVENTS_FILE))


@HTTP_API_BLUEPRINT.route('/upcoming_events', methods=['GET'])
def upcoming_events_handler():
    return flask.jsonify(application.events.get_upcoming_events(
        application.events.PATH_TO_EVENTS_FILE))
