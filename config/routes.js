/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.) 
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg` 
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or 
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  // 
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
//  '/': {
//    view: 'homepage'
//  },

    '/':                                'MainController.index',
    '/login':                           'MainController.login',
    '/logout':                          'MainController.logout',


  // Custom routes here...

    'patch         /user/changePassword/:id':     'UserController.changePassword',

    'get           /student/:id':                 'StudentController.find',
    'patch         /student/:id':                 'StudentController.updatePartial',
    'get           /student/:id/comment':         'StudentController.getComments',
//    'get           /student/enquiry':             'StudentController.getEnquiries',
//    'get           /student/enquiry/closed':      'StudentController.getClosedEnquiries',

    'get           /enquiry':                     'StudentController.getEnquiries',
    'get           /enquiry/closed':              'StudentController.getClosedEnquiries',
    'get           /student/:id/enrollment':      'StudentController.getEnrollments',
    'get           /student/:id/totalpayment':    'StudentController.getTotalPayments',
    'get           /student/service/:id':         'StudentController.getServiceEnrolledStudents',
    'get           /enrolled/student':            'StudentController.getEnrolledStudents',

    'get           /staff/:id/student':           'StaffController.getAssignedStudents',
    'get           /staff/:id/location':          'StaffController.getLocation',
    'patch         /staff/:id':                   'StaffController.updatePartial',

    'patch         /batch/:id':                   'BatchController.updatePartial',
    'get           /batch/:id/class':             'BatchController.getClasses',
    'get           /batch/current':               'BatchController.getCurrentBatches'


   // 'get /payments/totalpayment':    'PaymentController.totalPaymentsByEnrollId'


  // If a request to a URL doesn't match any of the custom routes above, it is matched 
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
