 CREATE VIEW topicview AS
 SELECT top.name,
    top.section,
    top.duration,
    s.name AS service,
    top.description,
    top.id,
    top.service AS ser_id
   FROM topic top,
    service s
  WHERE (s.id = top.service)