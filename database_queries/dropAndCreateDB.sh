#!/bin/sh
DB="Nirvana"
USER="postgres"
DIR="database_queries"

dropdb $DB
createdb $DB -O $USER