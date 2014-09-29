module.exports = function (grunt) {
	grunt.registerTask('default', [
        'compileAssets',
        'linkAssets',
        'createDBViews',
        'watch'
    ]);
};
