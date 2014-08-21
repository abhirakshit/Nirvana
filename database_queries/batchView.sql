 CREATE VIEW batchview AS
 SELECT batch_topic.name,
    batch_topic."startDate",
    batch_topic."endDate",
    batch_topic.service,
    batch_topic.type,
    batch_topic.id,
    batch_topic."totalTopic",
    clas."totalClass"
   FROM (( SELECT bach.name,
            bach."startDate",
            bach."endDate",
            bach.service,
            bach.type,
            bach.id,
            top."totalTopic"
           FROM (( SELECT b.name,
                    b."startDate",
                    b."endDate",
                    s.name AS service,
                    b.type,
                    b.id,
                    b.service AS ser_id
                   FROM batch b,
                    service s
                  WHERE (s.id = b.service)) bach
      LEFT JOIN ( SELECT tt.service,
                    count(*) AS "totalTopic"
                   FROM topic tt
                  GROUP BY tt.service) top ON ((bach.ser_id = top.service)))) batch_topic
   LEFT JOIN ( SELECT c.batch,
            count(*) AS "totalClass"
           FROM class c
          GROUP BY c.batch) clas ON ((batch_topic.id = clas.batch)))