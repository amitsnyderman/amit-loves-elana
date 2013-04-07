/*global module:false*/
module.exports = function(grunt) {

	grunt.initConfig({
		compass: {
			dist: {
				options: {
					require: ['susy'],
					sassDir: "assets/sass",
					cssDir: "assets/stylesheets",
					imagesDir: "assets/images",
					javascriptsDir: "assets/scripts",
					outputStyle: 'compressed',
					noLineComments: false
				}
			}
		},
		bower: {
			install: {
				options: {
					targetDir: './assets'
				}
			}
		},
		jekyll: {
			server: {
				dest: './_site',
				server: true,
				server_port: 4000,
				auto: true
			}
		},
		watch: {
			assets: {
				files: 'assets/sass/**/*',
				tasks: ['compass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-jekyll');

	grunt.registerTask('default', ['compass', 'bower']);
};
