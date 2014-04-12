define([], function(){
    Application.module("Consts", function(Consts, Application) {


        Application.STUDENT_ROLE = "student";
        Application.STAFF_ROLE = "staff";
        Application.ADMIN_ROLE = "admin";
        Application.SUPER_ADMIN_ROLE = "superAdmin";

        Application.START = "start";
        Application.SHOW = "show";
        Application.CLOSE = "close";
        Application.LOGOUT = "logout";


        Application.UPDATE_VIEW = "update:view";
        Application.CHILD_VIEW = "child:view";

        Application.BEFORE_START = "before:start";
        Application.WHEN_FETCHED = "when:fetched";
        Application.SHOW_LOADING = "show:loading";

        Application.CREATE_STUDENT = "create:student";


        Application.STREAM_LINK_SELECT = "stream:link:select";
        Application.STREAM_SELECT = "stream:select";
        Application.STREAM_CREATE = "stream:create";
        Application.STREAM_SHOW = "stream:show";
        Application.STREAM_GET = "stream:get";
        Application.STREAMS_GET = "streams:get";

        Application.DEGREES_BACHELORS_GET = "degrees:bachelors:get";
        Application.DEGREES_MASTERS_GET = "degrees:masters:get";
        Application.DEGREES_DOCTORATE_GET = "degrees:doctorate:get";
        Application.DEGREES_GET = "degrees:get";
        Application.DEGREE_GET = "degree:get";

        Application.SCHOOLS_GET = "schools:get";
        Application.SCHOOL_GET = "school:get";

        Application.MAJORS_GET = "majors:get";
        Application.MAJOR_GET = "major:get";
        Application.MAJOR_SHOW = "major:show";

        Application.OCCUPATIONS_GET = "occupations:get";
        Application.OCCUPATION_GET = "occupation:get";

        Application.COLLEGES_GET = "colleges:get";
        Application.COLLEGE_GET = "college:get";

        Application.SPECIALIZATIONS_GET = "specializations:get";
        Application.SPECIALIZATION_GET = "specialization:get";

        Application.GET_STUDENTS_ASSIGNED = "get:students:assigned";
        Application.GET_COUNSELORS = "get:counselors";
        Application.GET_COUNSELOR = "get:counselor";

        Application.GET_STUDENTS = "get:students";
        Application.GET_STUDENT = "get:student";

        Application.GET_STATUS = "get:status";
        Application.GET_STATUS_All = "get:status:all";

        Application.GET_COUNTRIES = "get:countries";
        Application.GET_COUNTRY = "get:country";

        Application.GET_SERVICES = "get:services";
        Application.GET_SERVICE = "get:service";

        Application.SEARCH_SHOW = "search:show";
        Application.CAREER_SHOW = "career:show";
        Application.QUERIES_SHOW = "queries:show";
        Application.PROFILE_SHOW = "profile:show";
        Application.PROFILES_SHOW = "profiles:show";
        Application.SETTINGS_SHOW = "settings:show";
        Application.PAYMENTS_SHOW = "payments:show";
        Application.ENQUIRIES_SHOW = "enquiries:show";
        Application.FORUM_SHOW = "forum:show";

        Application.STREAM_NAV_SHOW = "stream:nav:show";
        Application.CAREER_NAV_SHOW = "career:nav:show";
        Application.CAREER_CONTENT_SHOW = "career:content:show";


        Application.ENQUIRY_SHOW = "enquiry:show";
        Application.ENQUIRIES_CONTENT_SHOW = "enquiries:content:show";
        Application.ENQUIRIES_NAV_SHOW = "enquiries:nav:show";

        Application.SHOW_PROFILE = "showProfile";
        Application.SHOW_ADMIN = "showAdmin";
        Application.SHOW_MODULE = "showModule";

        Application.SET_SIDEBAR = "setSidebar";


        Application.CONTROLLER_ID = "controller";

//        Application.USER_URL = '/user';
        Application.GET_LOGGED_USER = "get:logged:user";
        Application.GET_USER = "get:user";
        Application.GET_PASSWORD = "get:password";
        Application.GET_ROLE = "get:role";
        Application.IS_USER_ADMIN = "isUserAdmin";
        Application.IS_STUDENT = "isStudent";
        Application.IS_COUNSELOR = "isCounselor";

    });
});