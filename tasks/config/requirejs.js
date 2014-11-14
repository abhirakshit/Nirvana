module.exports = function (grunt) {
    grunt.config.set('requirejs', {
        dev: {
            options: {


                mainConfigFile : "assets/js/app.js",
                baseUrl : "assets/js",
                name: "app",
                out: ".tmp/public/js/app.js",
                optimize: "none",
                removeCombined: true,
                findNestedDependencies: true




                /*
                When splitting into multiple jars
                 */
//                mainConfigFile: "assets/js/app.js",
//                baseUrl: "assets/js",
//                removeCombined: true,
//                findNestedDependencies: true,
////                dir: "dist",
//                dir: ".tmp/public/js",
//                optimize: "none",
//                modules: [
//                    {
//                        name: "app",
//                        optimize: "none",
//                        exclude: [
//                            "infrastructure"
//                        ]
//                    },
//                    {
//                        name: "infrastructure",
//                        optimize: "none",
//                        exclude: [
//                            "libs"
//                        ]
//                    },
//                    {
//                        optimize: "none",
//                        name: "libs"
//                    }
//                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
};
