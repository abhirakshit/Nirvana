#!/bin/sh
DB="Nirvana"
USER="postgres"
DIR="database_queries"

dropdb $DB -U $USER
createdb $DB -U $USER