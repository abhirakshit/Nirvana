 CREATE VIEW batchview AS
Select batch_topic."name", batch_topic."startDate",batch_topic."endDate", batch_topic.service, batch_topic."type", batch_topic."id", batch_topic."totalTopic", clas."totalClass"
 from (Select bach."name", bach."startDate", bach."endDate", bach.service, bach."type", bach."id", top."totalTopic"
from (select b."name", b."startDate", b."endDate", s."name" service, b."type" , b."id", b.service ser_id
from batch b, service s where s."id" = b.service) bach
LEFT JOIN
(select tt.service, count(*) "totalTopic" from topic tt group by tt.service) top
on bach.ser_id = top.service) batch_topic 
LEFT JOIN 
(select c.batch, count(*) as "totalClass" from "class" c group by c.batch) clas
on batch_topic."id" = clas.batch