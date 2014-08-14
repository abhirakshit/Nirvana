 SELECT aa.student_id AS id,
    aa.name,
    aa."enquiryDate",
    aa."enquiryStatus",
    aa."followUp",
    aa."phoneNumber",
    aa.services,
    aa.countries,
    bb."assignedTo",
    aa."createdAt",
    aa."updatedAt"
   FROM (( SELECT ssc.name,
            ssc."enquiryDate",
            ssc."enquiryStatus",
            ssc."followUp",
            ssc."phoneNumber",
            ssc.student_id,
            ssc."createdAt",
            ssc."updatedAt",
            ssc.services,
            scc.countries
           FROM (( SELECT st.name,
                    st."enquiryDate",
                    st."enquiryStatus",
                    st."followUp",
                    st."phoneNumber",
                    st.student_id,
                    st."createdAt",
                    st."updatedAt",
                    serv.services
                   FROM (( SELECT ((s."firstName" || ' '::text) || COALESCE(s."lastName", 'LNU'::text)) AS name,
                            s."enquiryDate",
                            s."followUp",
                            s."phoneNumber",
                            s.id AS student_id,
                            s."createdAt",
                            s."updatedAt",
                            es.name AS "enquiryStatus"
                           FROM student s,
                            enquirystatus es
                          WHERE (s."enquiryStatus" = es.id)) st
              LEFT JOIN ( SELECT string_agg(ser.name, ','::text) AS services,
                            ss.student_services
                           FROM service_students__student_services ss,
                            service ser
                          WHERE (ser.id = ss.service_students)
                          GROUP BY ss.student_services) serv ON ((st.student_id = serv.student_services)))) ssc
      LEFT JOIN ( SELECT string_agg(cc.name, ','::text) AS countries,
                    sc.student_countries
                   FROM country_students__student_countries sc,
                    country cc
                  WHERE (sc.country_students = cc.id)
                  GROUP BY sc.student_countries) scc ON ((scc.student_countries = ssc.student_id)))) aa
   LEFT JOIN ( SELECT string_agg(((st."firstName" || ' '::text) || st."lastName"), ','::text) AS "assignedTo",
            sas.student_staff
           FROM staff_students__student_staff sas,
            staff st,
            student stu
          WHERE ((stu.id = sas.student_staff) AND (st.id = sas.staff_students))
          GROUP BY sas.student_staff) bb ON ((aa.student_id = bb.student_staff)))