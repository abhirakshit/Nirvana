define([], function(){
    Application.module("Consts", function(Consts, Application) {

//        Application.DATE_FORMAT = "ddd, MMM Do 'YY, h:mm a"; // 'Do' does not work with Xeditable or DataTables sorting
        Application.DATE_ONLY_FORMAT = "MMM D 'YYYY";
        Application.DATE_FORMAT = "ddd, MMM D 'YY, h:mm a";
        Application.EDITABLE_DATE_FORMAT = "ddd, MMM DD 'YY, h:mm a";
        Application.EDITABLE_FORM_DATE_FORMAT = "DD MMM YYYY hh:mm a";
        Application.BATCH_DATE_FORMAT = "ddd, MMM DD 'YY";

        Application.ENQUIRY_ROLE = "enquiry";
        Application.STUDENT_ROLE = "student";
        Application.STAFF_ROLE = "staff";
        Application.ADMIN_ROLE = "admin";
        Application.SUPER_ADMIN_ROLE = "superAdmin";

        Application.START = "start";
        Application.SHOW = "show";
        Application.CLOSE = "close";
        Application.LOGOUT = "logout";
        Application.DELETE = "delete";
        Application.CONFIRM = "confirm";
        Application.SUBMIT = "submit";


        Application.UPDATE_VIEW = "update:view";
        Application.CHILD_VIEW = "child:view";

        Application.BEFORE_START = "before:start";
        Application.WHEN_FETCHED = "when:fetched";
        Application.SHOW_LOADING = "show:loading";

        Application.CREATE_STUDENT = "create:student";
        Application.CREATE_USER = "create:user";

        Application.CHANGE_PASSWORD = "change:password";


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
        Application.GET_STUDENTS_ENROLLED = "get:students:enrolled";
        Application.GET_STUDENTS_ENROLLED_SERVICE = "get:students:enrolled:service";

        Application.GET_ALL_STAFF = "get:all:staff";
        Application.GET_STAFF = "get:staff";
        Application.GET_STAFF_NAME = "get:staff:name";

        Application.GET_BATCHES = "get:batches";
        Application.GET_BATCH = "get:batch";
        Application.GET_BATCH_CLASSES = "get:batch:classes";

        Application.GET_CLASSES = "get:classes";
        Application.GET_CLASS = "get:class";

        Application.GET_TOPICS = "get:topics";
        Application.GET_TOPICS_SERVICE = "get:topics:service";
        Application.GET_TOPIC = "get:topic";
        Application.UPDATE_TOPICS = "update:topics";

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
        Application.GET_LOCATIONS = "get:locations";
        Application.GET_LOCATION = "get:location";
        Application.GET_ENROLLMENTS = "get:enrollments";
        Application.GET_ENROLLMENT = "get:enrollment";
        Application.GET_ENROLLMENT_BY_STUDENTID = "get:student:enrollment";
        Application.GET_STUDENT_ENROLLMENTS = "get:student:enrollments";

        Application.GET_PAYMENT = "get:payment";
        Application.GET_PAYMENTS = "get:payments";
        Application.GET_TOTAL_PAYMENT = "get:totalPayment";


        Application.GET_SERVICES = "get:services";
        Application.GET_SERVICE = "get:service";
        Application.GET_SERVICE_NAME = "get:service:name";

        Application.GET_EDUCATION_LIST = "get:education:list";
        Application.GET_EDUCATION = "get:education";

        Application.SEARCH_SHOW = "search:show";
        Application.CAREER_SHOW = "career:show";
        Application.QUERIES_SHOW = "queries:show";
        Application.PROFILE_SHOW = "profile:show";
        Application.PROFILES_SHOW = "profiles:show";
        Application.SETTINGS_SHOW = "settings:show";
        Application.PAYMENTS_SHOW = "payments:show";

//        Application.BATCHES_SHOW = "batches:show";
        Application.CLASS_SHOW = "class:show";

        Application.BATCHES_SHOW = "batches:show";
        Application.BATCH_SHOW = "batch:show";
        Application.BATCHES_LIST_CURRENT = "batches:list:current";
        Application.BATCHES_LIST_ALL = "batches:list:all";

        Application.TOPICS_SHOW = "topics:show";
        Application.TOPIC_SHOW = "topic:show";
        Application.TOPICS_LIST_CURRENT = "topics:list:current";
        Application.TOPICS_LIST_ALL = "topics:list:all";

        Application.PAYMENTS_SHOW = "payments:show";
        Application.PAYMENT_SHOW = "payment:show";
        Application.PAYMENTS_LIST_CURRENT = "payments:list:current";
        Application.PAYMENTS_LIST_ALL = "payments:list:all";

        Application.FORUM_SHOW = "forum:show";
        Application.STAFF_SHOW = 'staff:show';
        Application.STUDENT_SHOW = 'student:show';
        Application.STUDENTS_SHOW = "students:show";

        Application.STREAM_NAV_SHOW = "stream:nav:show";
        Application.CAREER_NAV_SHOW = "career:nav:show";
        Application.CAREER_CONTENT_SHOW = "career:content:show";

//        Enquiries.SELECTED_ENQUIRY = "selected:enquiry";
//        Application.ENQUIRY_SELECTED = "enquiry:show";
        Application.ENQUIRIES_SHOW = "enquiries:show";
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
        Application.GET_CHANGE_PASSWORD_USER = "get:change:password:user";
        Application.GET_ROLE = "get:role";
        Application.IS_USER_ADMIN = "isUserAdmin";
        Application.IS_STUDENT = "isStudent";
        Application.IS_COUNSELOR = "isCounselor";

    });
});