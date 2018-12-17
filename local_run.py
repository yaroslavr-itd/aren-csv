import os

import aren_csv_app

HOST = os.getenv('QEPCCC_HOST', 'localhost')
PORT = os.getenv('QEPCCC_PORT', 8080)
DEBUG = os.getenv('QEPCCC_DEBUG', True)

APP = aren_csv_app.create_app()

APP.run(host=HOST, port=PORT, debug=DEBUG)
