 CREATE VIEW enrollview AS
 SELECT stu_pay_con_staff.name,
    stu_pay_con_staff."followUp",
    stu_pay_con_staff."phoneNumber",
    stu_pay_con_staff.student_id AS id,
    stu_pay_con_staff."createdAt",
    stu_pay_con_staff."updatedAt",
    stu_pay_con_staff."enquiryStatus",
    stu_pay_con_staff."enquiryDate",
    stu_pay_con_staff.services,
    stu_pay_con_staff."totalFee",
    stu_pay_con_staff."totalPaid",
    (stu_pay_con_staff."totalFee" - stu_pay_con_staff."totalPaid") AS "totalDue",
    stu_pay_con_staff.countries,
    stu_pay_con_staff."assignedTo",
    loc.locations
   FROM (( SELECT stu_pay_con.name,
            stu_pay_con."followUp",
            stu_pay_con."phoneNumber",
            stu_pay_con.student_id,
            stu_pay_con."createdAt",
            stu_pay_con."updatedAt",
            stu_pay_con."enquiryStatus",
            stu_pay_con."enquiryDate",
            stu_pay_con.services,
            stu_pay_con."totalFee",
            stu_pay_con."totalPaid",
            stu_pay_con.countries,
            stf."assignedTo"
           FROM (( SELECT stu_pay.name,
                    stu_pay."followUp",
                    stu_pay."phoneNumber",
                    stu_pay.student_id,
                    stu_pay."createdAt",
                    stu_pay."updatedAt",
                    stu_pay."enquiryStatus",
                    stu_pay."enquiryDate",
                    stu_pay.services,
                    stu_pay."totalFee",
                    stu_pay."totalPaid",
                    stu_con.countries
                   FROM (( SELECT stu.name,
                            stu."followUp",
                            stu."phoneNumber",
                            stu.student_id,
                            stu."createdAt",
                            stu."updatedAt",
                            stu."enquiryStatus",
                            stu."enquiryDate",
                            paym.services,
                            COALESCE(paym."TotalPaid", (0)::double precision) AS "totalPaid",
                            COALESCE(paym."totalFee", (0)::double precision) AS "totalFee"
                           FROM (( SELECT ((s."firstName" || ' '::text) || COALESCE(s."lastName", 'LNU'::text)) AS name,
                                    s."enquiryDate",
                                    s."followUp",
                                    s."phoneNumber",
                                    s.id AS student_id,
                                    s."createdAt",
                                    s."updatedAt",
                                    es.name AS "enquiryStatus"
                                   FROM student s,
                                    enquirystatus es,
                                    location_students__student_locations stuloc
                                  WHERE (((s."enquiryStatus" = es.id) AND (es.name = 'Enrolled'::text)) AND (stuloc.student_locations = s.id))) stu
                      LEFT JOIN ( SELECT enr_ser.student,
                                    string_agg(enr_ser.serv, ', '::text) AS services,
                                    sum(enr_ser."totalFee") AS "totalFee",
                                    sum(COALESCE(pmt.amount, (0)::double precision)) AS "TotalPaid"
                                   FROM (( SELECT e."totalFee",
                                            e.student,
                                            s.name AS serv,
                                            e.id AS enroll_id
                                           FROM enroll e,
                                            service s
                                          WHERE (e.service = s.id)) enr_ser
                              LEFT JOIN payment pmt ON ((enr_ser.enroll_id = pmt.enroll)))
                             GROUP BY enr_ser.student) paym ON ((paym.student = stu.student_id)))) stu_pay
              LEFT JOIN ( SELECT string_agg(cc.name, ', '::text) AS countries,
                            sc.student_countries
                           FROM country_students__student_countries sc,
                            country cc
                          WHERE (sc.country_students = cc.id)
                          GROUP BY sc.student_countries) stu_con ON ((stu_con.student_countries = stu_pay.student_id)))) stu_pay_con
      LEFT JOIN ( SELECT string_agg(((st."firstName" || ' '::text) || st."lastName"), ', '::text) AS "assignedTo",
                    sas.student_staff
                   FROM staff_students__student_staff sas,
                    staff st
                  WHERE (st.id = sas.staff_students)
                  GROUP BY sas.student_staff) stf ON ((stu_pay_con.student_id = stf.student_staff)))) stu_pay_con_staff
   LEFT JOIN ( SELECT sloc.student_locations,
            string_agg(sas.name, ', '::text) AS locations
           FROM location sas,
            location_students__student_locations sloc
          WHERE (sloc.location_students = sas.id)
          GROUP BY sloc.student_locations) loc ON ((stu_pay_con_staff.student_id = loc.student_locations)))