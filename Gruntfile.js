module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-run');

    // A very basic default task.
    grunt.registerTask('default', 'Log some stuff.', function() {
      grunt.log.write('Logging some stuff...').ok();
    });


    grunt.registerTask("clean", "Cleaning",function(){
        
    });
  
  };