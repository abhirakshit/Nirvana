#!/bin/sh
DB="Nirvana"
USER="admin"
DIR="database_queries"
psql $DB $USER -a -f $DIR/dropAllViews.sql