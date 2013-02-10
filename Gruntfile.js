/*global module:false*/
module.exports = function(grunt) {

	grunt.initConfig({
		compass: {
			dist: {
				options: {
					config: 'config.rb'
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
				files: 'assets/**/*',
				tasks: ['default']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-jekyll');

	grunt.registerTask('default', ['compass', 'bower']);
};
