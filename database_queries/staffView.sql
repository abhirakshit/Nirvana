 CREATE VIEW staffview AS
   SELECT staf.name,
    staf.email,
    staf."phoneNumber",
    staf.id,
    staf."createdAt",
    staf."updatedAt",
    loc.locations
   FROM (( SELECT ((st."firstName" || ' '::text) || st."lastName") AS name,
            st.email,
            st."phoneNumber",
            st.id,
            st."createdAt",
            st."updatedAt"
           FROM staff st) staf
   LEFT JOIN ( SELECT sloc.staff_locations,
            string_agg(sas.name, ', '::text) AS locations
           FROM location sas,
            location_staff__staff_locations sloc
          WHERE (sloc.location_staff = sas.id)
          GROUP BY sloc.staff_locations) loc ON ((staf.id = loc.staff_locations)))