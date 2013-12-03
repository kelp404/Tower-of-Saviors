
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
                for img in $('[data-image-key]')
                    src = $(img).attr 'data-src'
                    src ?= $(img).attr 'src'
                    src = src.replace /thumb\/|\/60px-.*/g, ''
                    @request url: src, encoding: null, (error, response, body) =>
                        fileName = response.request.href.match(/^.*\/([0-9]+i\.png)$/)[1].replace 'i.png', '-100.png'
                        @fs.writeFile "images/cards/#{fileName}", body
        return

salmon = new Salmon()
salmon.fetchImages()
