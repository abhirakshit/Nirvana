#!/bin/sh
DB="Nirvana"
USER="postgres"
DIR="database_queries"
psql $DB $USER -a -f $DIR/dropAllViews.sql