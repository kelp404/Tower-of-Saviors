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
            dataCards:
                options:
                    bare: yes
                files:
                    './data/zh-TW/cards.ori.js': ['./data/zh-TW/_source/cards.coffee']
            dataCardTW:
                options:
                    bare: yes
                expand: yes
                flatten: yes
                cwd: 'data/zh-TW/cards'
                src: ['**/_source/*.coffee']
                dest: 'data/zh-TW/cards/'
                ext: '.ori.js'
            salmon:
                expand: yes
                flatten: no
                cwd: 'salmon'
                src: ['**/*.coffee']
                dest: 'salmon/'
                ext: '.js'

        uglify:
            options:
                mangle: no
                compress: no
                report: 'min'
            data:
                files: [
                    expand: yes
                    cwd: 'data'
                    src: ['**/*.ori.js']
                    dest: 'data'
                    ext: '.min.js'
                ]

        watch:
            compass:
                files: ['./src/*.scss']
                tasks: ['compass']
                options:
                    spawn: no
            coffeeSource:
                files: ['./src/*.coffee']
                tasks: ['coffee:source']
                options:
                    spawn: no
            coffeeData:
                files: ['./data/**/*.coffee']
                tasks: ['coffee:dataCards', 'coffee:dataCardTW', 'uglify']
                options:
                    spawn: no
            coffeeSalmon:
                files: ['./salmon/*.coffee']
                tasks: ['coffee:salmon']
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
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-karma'