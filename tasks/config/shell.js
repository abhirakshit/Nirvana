module.exports = function (grunt) {
    grunt.config.set('shell', {
        dropDBViews: {
            options: {                        // Options
                stderr: false
            },
            command: './database_queries/dropDBViews.sh'
        },

        createDBViews: {                        // Target
            options: {                        // Options
                stderr: false
            },
            command: './database_queries/createDBViews.sh'
        }
    });

    grunt.loadNpmTasks('grunt-shell');
};