define([], function(){
    Application.module("Consts", function(Consts, Application) {

//        Application.DATE_FORMAT = "ddd, MMM Do 'YY, h:mm a"; // 'Do' does not work with Xeditable or DataTables sorting
        Application.DATE_FORMAT = "ddd, MMM D 'YY, h:mm a";
        Application.EDITABLE_DATE_FORMAT = "ddd, MMM DD 'YY, h:mm a";

        Application.ENQUIRY_ROLE = "enquiry";
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
        Application.CREATE_USER = "create:user";


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
        Application.GET_ALL_STAFF = "get:all:staff";
        Application.GET_STAFF = "get:staff";

        Application.GET_ENQUIRIES = "get:enquiries";
        Application.GET_ENQUIRIES_CLOSED = "get:enquiries:closed";
        Application.GET_ENQUIRIES_ASSIGNED = "get:enquiries:assigned";

        Application.GET_STUDENTS = "get:students";
        Application.GET_STUDENT = "get:student";

        Application.GET_STUDENT_COMMENTS = "get:student:comments";

        Application.GET_STATUS = "get:status";
        Application.GET_STATUS_All = "get:status:all";

        Application.GET_COUNTRIES = "get:countries";
        Application.GET_COUNTRY = "get:country";

        Application.GET_SERVICES = "get:services";
        Application.GET_SERVICE = "get:service";

        Application.GET_EDUCATION_LIST = "get:education:list";
        Application.GET_EDUCATION = "get:education";

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

//        Enquiries.SELECTED_ENQUIRY = "selected:enquiry";
//        Application.ENQUIRY_SELECTED = "enquiry:show";
        Application.ENQUIRY_SHOW = "enquiry:show";
        Application.ENQUIRIES_NAV_SHOW = "enquiries:nav:show";
//        Application.ENQUIRIES_CONTENT_SHOW = "enquiries:content:show";
        Application.ENQUIRIES_CONTENT_MY = "enquiries:content:my";
        Application.ENQUIRIES_CONTENT_ALL = "enquiries:content:all";
        Application.ENQUIRIES_CONTENT_ALL_BY_DATE = "enquiries:content:all:by:date";
        Application.ENQUIRIES_CONTENT_JOINED = "enquiries:content:joined";
        Application.ENQUIRIES_CONTENT_CLOSED = "enquiries:content:closed";

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