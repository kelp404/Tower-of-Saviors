
class Salmon
    constructor: (@lang, @url) ->
        # properties
        @lang ?= 'zh-TW'
        @url ?= 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92'

        # modules
        @request = require 'request'
        @jquery = require 'jquery'
        @fs = require 'fs'

    fetchImages: =>
        @request @url, (error, response, body) =>
            if not error and response.statusCode < 300
                # parse the html and create a dom window
                window = require('jsdom').jsdom body, null,
                    FetchExternalResources: no
                    ProcessExternalResources: no
                    MutationEvents: no
                    QuerySelector: no
                .createWindow()
                # apply jquery to the window
                $ = @jquery.create window
                for index in [0...50] by 1
                    img = $('[data-image-key]')[index]
                    src = $(img).attr 'data-src'
                    src ?= $(img).attr 'src'
                    src = src.replace /thumb\/|\/60px-.*/g, ''
                    match = src.match(/^.*\/([0-9]+i\.png)$/)
                    if match
                        fileName = match[1].replace 'i.png', '-100.png'
                        @request(src).pipe @fs.createWriteStream("images/cards/#{fileName}")
                    else
                        console.error "error #{src}"
        return

salmon = new Salmon()
salmon.fetchImages()
