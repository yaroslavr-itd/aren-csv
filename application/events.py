import csv
import datetime
import os

PATH_TO_EVENTS_FILE = os.getenv('QEPCCC_PATH_TO_EVENTS_FILE')


class Event:

    def __init__(self, booking_start_date=None, booking_start_time=None, booking_end_date=None,
                 booking_end_time=None, start_date_time=None, end_date_time=None, booking_type_id=None,
                 facility_master_title=None, facility_title=None, event_name=None, function_title=None,
                 activity_title=None, booking_notes=None, *args, **kwargs):
        self.booking_start_date = booking_start_date
        self.booking_start_time = booking_start_time
        self.booking_end_date = booking_end_date
        self.booking_end_time = booking_end_time
        self.start_date_time = start_date_time
        self.end_date_time = end_date_time
        self.booking_type_id = booking_type_id
        self.facility_master_title = facility_master_title
        self.facility_title = facility_title
        self.event_name = Event.remove_excessive_text(
            event_name, ['2018-2019', '2017-2019', '2018', '2017', ' QE '])
        self.function_title = function_title
        self.activity_title = activity_title
        self.booking_notes = booking_notes

    @staticmethod
    def remove_excessive_text(string, excessive=None):
        if excessive is None:
            return string

        for text in excessive:
            string = string.replace(text, '')
        return string

    @classmethod
    def make_event(cls, **kwargs):
        fixed_kwargs = {
            key.lower(): value.strip() if isinstance(value, str) else value
            for key, value in kwargs.items() if isinstance(key, str)}
        return cls(**fixed_kwargs)

    @classmethod
    def make_events(cls, collection):
        return [cls.make_event(**item) for item in collection if isinstance(item, dict)]


def read_events(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=',', restkey='rest')
            return Event.make_events([row for row in reader])
    except FileNotFoundError:
        return []


ACTUAL_EVENTS = read_events(PATH_TO_EVENTS_FILE)


def get_all_events():
    return ACTUAL_EVENTS


def get_upcoming_events(timestamp=None):
    if timestamp is None:
        timestamp = int(datetime.datetime.now().timestamp())

    upcoming_events = [
        event for event in get_all_events() if datetime.datetime.strptime(
            event.end_date_time, '%Y-%m-%d %H:%M:%S') > datetime.datetime.fromtimestamp(timestamp)]

    upcoming_events = [
        event for event in upcoming_events if 'pool' not in event.facility_title.lower() or
                                              'pool' not in event.event_name]

    upcoming_events.sort(key=lambda event: datetime.datetime.strptime(
        event.start_date_time, '%Y-%m-%d %H:%M:%S'))

    return upcoming_events
