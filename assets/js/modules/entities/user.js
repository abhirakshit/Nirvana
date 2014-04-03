define([
    "modules/entities/base/models",
    "modules/entities/base/collections"
], function(){
    Application.module("Entities", function(Entities, Application, Backbone, Marionette, $, _) {

        Entities.studentUrl = '/student';
        Entities.counselorUrl = '/counselor';
        Entities.userUrl = '/user';
//        Entities.allUsersUrl = '/users';
//        Entities.allCounselorsUrl = "/users/counselors";

        Entities.loggedUserId = window.userId.replace(/&quot;/g, '');
        Entities.User = Entities.Model.extend({
            urlRoot: Entities.userUrl,
            validation: {
                firstName: {required: true},
                email: {required: true, pattern: 'email'},
                password: {required: true},
                confirmPassword: {equalTo: 'password'}
            }
        });

        Entities.Student = Entities.Model.extend({
            urlRoot: Entities.studentUrl,
            validation: {
                firstName: {required: true},
                email: {required: true, pattern: 'email'}
            }
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

//        Entities.StudentsAssignedCollection = Entities.Collection.extend({
//            model: Entities.User,
//            url: Entities.allUsersUrl
//        });

        var API = {

            getStudent: function(studentId) {
                if (!studentId)
                    return new Entities.Student();

                var student = new Entities.Student();
                student.id = studentId;
                student.fetch();
                return student;
            },

            getStudentsAssigned: function(userId) {
                if(!userId) {
                    userId = Entities.loggedUser.get('id');
                }

//                var studentsAssigned = new Entities.UsersCollection();
//                studentsAssigned.url = function() {
//                    return Entities.userUrl + "/" + userId + "/students";
//                };
//                studentsAssigned.fetch();
                var studentsAssigned = new Entities.UsersCollection(Entities.loggedUser.get('students'));
                return studentsAssigned;
            },

//            getAllCounselors: function() {
//                if (!Entities.allCounselors) {
//                    Entities.allCounselors = new Entities.UsersCollection();
//                    Entities.allCounselors.url = Entities.allCounselorsUrl;
//                    Entities.allCounselors.fetch();
//                }
//
//                return Entities.allCounselors;
//            },

            getPassword: function() {
                return new Entities.Password();
            },

            getUser: function(userId) {
                if (!userId)
                    return new Entities.User();

                var user = new Entities.User({id: userId});
                user.fetch();
                return user;

            },

            getLoggedUser: function () {
                if (!Entities.loggedUser) {
                    Entities.loggedUser = new Entities.User({id: Entities.loggedUserId});
//                    Entities.loggedUser.urlRoot = Entities.counselorUrl;
                    Entities.loggedUser.fetch({async: false});
                }

//                console.dir(Entities.loggedUser.get('students'));
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
                return role == Application.COUNSELOR_ROLE;
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
            }
        };

        Application.reqres.setHandler(Application.GET_LOGGED_USER, function(){
            return API.getLoggedUser();
        });

        Application.reqres.setHandler(Application.GET_USER, function(userId){
            return API.getUser(userId);
        });

        Application.reqres.setHandler(Application.GET_STUDENT, function(studentId){
            return API.getStudent(studentId);
        });

        Application.reqres.setHandler(Application.GET_PASSWORD, function(){
            return API.getPassword();
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

//        Application.reqres.setHandler(Application.COUNSELORS_GET, function(){
//            return API.getAllCounselors();
//        });

        Application.reqres.setHandler(Application.STUDENTS_ASSIGNED_GET, function(userId){
            return API.getStudentsAssigned(userId);
        });

        Application.reqres.setHandler(Application.LOGOUT, function(){
            return API.logout();
        });

    });
});