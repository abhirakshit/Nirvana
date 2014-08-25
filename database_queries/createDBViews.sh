#!/bin/sh
DB="Nirvana"
USER="postgres"
DIR="database_queries"
psql $DB $USER -a -f $DIR/studentView.sql
psql $DB $USER -a -f $DIR/staffView.sql
psql $DB $USER -a -f $DIR/batchView.sql
psql $DB $USER -a -f $DIR/topicView.sql