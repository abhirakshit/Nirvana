CREATE VIEW enquiry_view AS SELECT aa.student_id,
    aa.name,
    aa."enquiryDate",
    aa."followUp",
    aa."phoneNumber",
    aa.services,
    aa.countries,
    bb."assignedTo"
   FROM (( SELECT ssc.name,
            ssc."enquiryDate",
            ssc."followUp",
            ssc."phoneNumber",
            ssc.student_id,
            ssc.services,
            scc.countries
           FROM (( SELECT st.name,
                    st."enquiryDate",
                    st."followUp",
                    st."phoneNumber",
                    st.student_id,
                    serv.services
                   FROM (( SELECT ((s."firstName" || ' '::text) || s."lastName") AS name,
                            s."enquiryDate",
                            s."followUp",
                            s."phoneNumber",
                            s.id AS student_id
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
   LEFT JOIN ( SELECT string_agg(st."firstName", ','::text) AS "assignedTo",
            sas.student_staff
           FROM staff_students__student_staff sas,
            staff st,
            student stu
          WHERE ((stu.id = sas.student_staff) AND (st.id = sas.staff_students))
          GROUP BY sas.student_staff) bb ON ((aa.student_id = bb.student_staff)))