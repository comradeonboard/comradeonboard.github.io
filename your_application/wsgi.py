"""Fallback for Render's older default start command: gunicorn your_application.wsgi."""

from app import app

application = app
