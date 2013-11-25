module.exports = (grunt) ->
    # -----------------------------------
    # Options
    # -----------------------------------
    grunt.config.init
        compass:
            src:
                options:
                    sassDir: './src'
                    cssDir: './dist'
                    outputStyle: 'compressed'

        coffee:
            source:
                files:
                    './dist/tower-of-saviors.js': ['./src/*.coffee']
            data:
                options:
                    bare: yes
                expand: yes
                flatten: no
                cwd: 'data'
                src: ['**/*.coffee']
                dest: 'data/'
                ext: '.js'

        watch:
            compass:
                files: ['./src/*.scss']
                tasks: ['compass']
                options:
                    spawn: no
            coffee:
                files: ['./src/*.coffee', './data/**/*.coffee']
                tasks: ['coffee']
                options:
                    spawn: no

        connect:
            server:
                options:
                    protocol: 'http'
                    hostname: '*'
                    port: 8000
                    base: '.'

        karma:
            min:
                configFile: './test/karma-min.config.coffee'
            js:
                configFile: './test/karma.config.coffee'

    # -----------------------------------
    # register task
    # -----------------------------------
    grunt.registerTask 'dev', ['connect', 'watch']
    grunt.registerTask 'test', ['karma']

    # -----------------------------------
    # Plugins
    # -----------------------------------
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-karma'