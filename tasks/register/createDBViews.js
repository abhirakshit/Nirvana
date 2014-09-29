module.exports = function (grunt) {
    grunt.registerTask('createDBViews', [
        'shell:dropDBViews',
        'shell:createDBViews'
    ]);
};