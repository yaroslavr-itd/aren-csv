import os

import watchdog
import watchdog.events
import watchdog.observers

PATH_TO_OBSERVE = os.getenv('ARENCSV_PATH_TO_OBSERVE')
FILE_NAME = os.getenv('ARENCSV_FILE_NAME')


class CustomEventHandler(watchdog.events.FileSystemEventHandler):

    def __init__(self, filename, handler=None):
        self.filename = filename
        self.handler = handler

    def add_handler(self, handler):
        self.handler = handler

    def on_modified(self, event):
        super(CustomEventHandler, self).on_modified(event)

        if not isinstance(event, watchdog.events.FileModifiedEvent):
            return

        if not event.src_path.endswith(self.filename):
            return

        if self.handler is not None:
            self.handler(event.src_path)


def start_observer(path_to_observe, filename, handler):
    event_handler = CustomEventHandler(filename, handler)
    observer = watchdog.observers.Observer()
    observer.schedule(event_handler, path_to_observe, recursive=False)
    observer.start()
    return observer
