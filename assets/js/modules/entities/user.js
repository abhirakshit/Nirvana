define([
    "modules/entities/base/models",
    "modules/entities/base/collections"
], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

//        Entities.studentUrl = '/student';
        Entities.studentUrl = '/student';
        Entities.enquiryUrl = '/enquiry';
        Entities.closedUrl = '/closed';
        Entities.staffUrl = '/staff';
        Entities.userUrl = '/user';
        Entities.enrolledUrl = '/enrolled';
//        Entities.allUsersUrl = '/users';
//        Entities.allCounselorsUrl = "/users/counselors";

        Entities.loggedUserId = window.userId.replace(/&quot;/g, '');
        Entities.User = Entities.Model.extend({
            urlRoot: Entities.userUrl,
            validation: {
                firstName: {required: true},
                phoneNumber: {required: true},
                email: {required: true, pattern: 'email'}
            }
        });

        Entities.ChangePasswordUser = Application.Entities.Model.extend({
            urlRoot: Entities.userUrl,
            validation: {
                currentPassword: {
                    required: true
                },

                newPassword: {
                    required: true,
                    fn: 'notEqualToCurrentPassword'
                },

                confirmPassword: {
                    equalTo: 'newPassword'
                }
            },

            notEqualToCurrentPassword: function(value, attr, computedState) {
                if (value === computedState.currentPassword)
                    return "Enter different password";
            }
        });

        Entities.Student = Entities.Model.extend({
            urlRoot: Entities.studentUrl,
            validation: {
                firstName: {required: true},
                phoneNumber: {required: true},
                followUp: {required: true},
                email: {pattern: 'email'}
            }
        });

        Entities.Staff = Entities.Model.extend({
            urlRoot: Entities.staffUrl,
            validation: {
                firstName: {required: true},
                phoneNumber: {required: true},
                followUp: {required: true},
                email: {pattern: 'email'}
            }
        });

        Entities.StudentCollection = Entities.Collection.extend({
            url: Entities.studentUrl,
            model: Entities.Student
        });

           Entities.StaffCollection = Entities.Collection.extend({
            url: Entities.staffUrl,
            model: Entities.Staff
        });

        Entities.Password = Entities.Model.extend({
            validation: {
                password: {required: true},
                confirmPassword: {equalTo: 'password'}
            }
        });

        Entities.UsersCollection = Entities.Collection.extend({
            model: Entities.User,
            url: Entities.userUrl
        });


        var API = {

            getStudentsAssigned: function(userId) {
                if (!userId) {
                    userId = Entities.loggedUser.get('id');
                }

                var studentsAssigned = new Entities.StudentCollection(Entities.loggedUser.get('students'));
                studentsAssigned.fetch();
                return studentsAssigned;
            },

            getEnquiriesAssigned: function(userId) {
                if (!userId) {
                    userId = Entities.loggedUser.get('id');
                }

                var studentsAssigned = new Entities.StudentCollection();
                studentsAssigned.url = Entities.staffUrl + "/" + userId + Entities.studentUrl;
                studentsAssigned.fetch();
                return studentsAssigned;
            },

            getAllStaff: function(update) {
                if (!Entities.allStaff || update) {
                    Entities.allStaff = new Entities.StaffCollection();
                    Entities.allStaff.url = Entities.staffUrl;
                    Entities.allStaff.fetch();
                }

                return Entities.allStaff;
            },

            // getStaff: function(staffId) {
            //     if (!staffId)
            //         return new Entities.Staff();

            //     var staff = new Entities.Staff({id: staffId});
            //     staff.id = staffId;
            //     staff.fetch();
            //     return staff;
            // },


            getStaff: function(staffId) {
                if (!staffId)
                    return new Entities.Staff();

                var staff = new Entities.Staff({id: staffId});
                staff.fetch();
                return staff;

            },

            getPassword: function() {
                return new Entities.Password();
            },

            getChangePasswordUser: function(userId) {
                if (!userId)
                    return null;
                var user = new Entities.ChangePasswordUser({ id: userId });
                user.fetch({async: false});
                return user;
            },

            getUser: function(userId) {
                if (!userId)
                    return new Entities.User();

                var user = new Entities.User({id: userId});
                user.fetch();
                return user;

            },

            getAllStudents: function(update) {
//                if (!Entities.allStudents || update) {
                    Entities.allStudents = new Entities.StudentCollection();
                    Entities.allStudents.fetch();
//                }

                return Entities.allStudents;
            },

            getAllEnquiries: function(update) {
                Entities.allEnquiries = new Entities.StudentCollection();
                Entities.allEnquiries.url = Entities.studentUrl + Entities.enquiryUrl;
                Entities.allEnquiries.fetch();

                return Entities.allEnquiries;
            },

            getAllClosedEnquiries: function(update) {
                Entities.allEnquiries = new Entities.StudentCollection();
                Entities.allEnquiries.url = Entities.studentUrl + Entities.enquiryUrl + Entities.closedUrl;
                Entities.allEnquiries.fetch();

                return Entities.allEnquiries;
            },

            getStudent: function(userId) {
                if (!userId)
                    return new Entities.Student();

                var student = new Entities.Student({id: userId});
                student.fetch();
                return student;

            },

            getLoggedUser: function () {
                if (!Entities.loggedUser) {
                    // get user object from server
                    var user = new Entities.User({id: Entities.loggedUserId});
                    user.fetch({async: false});

                    //determine user type and get student/staff
                    var urlRoot, userId;
                    if (user.get(Application.STAFF_ROLE)) {
                        urlRoot = Entities.staffUrl;
                        userId = user.get(Application.STAFF_ROLE).id;
                    } else {
                        urlRoot = Entities.studentUrl;
                        userId = user.get(Application.STUDENT_ROLE).id
                    }


                    Entities.loggedUser = new Entities.User({id: userId});
                    Entities.loggedUser.urlRoot = urlRoot;
                    Entities.loggedUser.fetch({async: false});
                }

                return Entities.loggedUser;
            },

            isAdmin: function () {
                var role = this.getRole();
                return role == Application.ADMIN_ROLE || role == Application.SUPER_ADMIN_ROLE;
            },

            isStudent: function () {
                var role = this.getRole();
                return role == Application.STUDENT_ROLE;
            },

            isCounselor: function () {
                var role = this.getRole();
                return role == Application.STAFF_ROLE;
            },

            getRole: function() {
                return this.getLoggedUser().attributes.role;
            },

            logout: function () {
                $.ajax({
                    url: Application.LOGOUT,
                    success: function() {
                        console.log("Logged Out...");
                        window.location.reload();
                    }
                })
            },


            getAllEnrolled: function(update) {
                Entities.allEnrolled = new Entities.StudentCollection();
                Entities.allEnrolled.url = Entities.studentUrl + Entities.enrolledUrl;
                Entities.allEnrolled.fetch();

                return Entities.allEnrolled;
            }



        };

        Application.reqres.setHandler(Application.GET_LOGGED_USER, function(){
            return API.getLoggedUser();
        });

        Application.reqres.setHandler(Application.GET_USER, function(userId){
            return API.getUser(userId);
        });

        Application.reqres.setHandler(Application.GET_STUDENTS, function(update){
            return API.getAllStudents(update);
        });

        Application.reqres.setHandler(Application.GET_ENQUIRIES, function(update){
            return API.getAllEnquiries(update);
        });

        Application.reqres.setHandler(Application.GET_STUDENT, function(studentId){
            return API.getStudent(studentId);
        });

        Application.reqres.setHandler(Application.GET_PASSWORD, function(){
            return API.getPassword();
        });

        Application.reqres.setHandler(Application.GET_CHANGE_PASSWORD_USER, function(userId){
            return API.getChangePasswordUser(userId);
        });

        Application.reqres.setHandler(Application.IS_USER_ADMIN, function(){
            return API.isAdmin();
        });

        Application.reqres.setHandler(Application.GET_ROLE, function(){
            return API.getRole();
        });

        Application.reqres.setHandler(Application.IS_STUDENT, function(){
            return API.isStudent();
        });

        Application.reqres.setHandler(Application.IS_COUNSELOR, function(){
            return API.isCounselor();
        });

        Application.reqres.setHandler(Application.GET_ALL_STAFF, function(update){
            return API.getAllStaff(update);
        });

        
        Application.reqres.setHandler(Application.GET_STAFF, function(staffId){
            return API.getStaff(staffId);
        });

        Application.reqres.setHandler(Application.GET_STUDENTS_ASSIGNED, function(userId){
            return API.getStudentsAssigned(userId);
        });

        Application.reqres.setHandler(Application.GET_ENQUIRIES_ASSIGNED, function(userId){
            return API.getEnquiriesAssigned(userId);
        });

        Application.reqres.setHandler(Application.GET_ENQUIRIES_CLOSED, function(){
            return API.getAllClosedEnquiries(false);
        });

        Application.reqres.setHandler(Application.LOGOUT, function(){
            return API.logout();
        });

        Application.reqres.setHandler(Application.GET_STUDENTS_ENROLLED, function(){
            return API.getAllEnrolled();
        });

    });
});