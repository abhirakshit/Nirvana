 CREATE VIEW topicview AS
select top."name", top."section", top.duration, s."name" service, top.description
from topic top, service s where s."id" = top.service