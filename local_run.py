import os

import qepccc_app

HOST = os.getenv('QEPCCC_HOST', 'localhost')
PORT = int(os.getenv('QEPCCC_PORT', 8080))
DEBUG = bool(os.getenv('QEPCCC_DEBUG', True))

APP = qepccc_app.create_app()

APP.run(host=HOST, port=PORT, debug=DEBUG)
