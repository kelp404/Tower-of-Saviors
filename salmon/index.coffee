
class Salmon
    constructor: (@lang, @url) ->
        # properties
        @lang ?= 'zh-TW'
        @url ?= 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92'

        # modules
        @request = require 'request'
        @jquery = require 'jquery'
        @fs = require 'fs'
        @jsdom = require 'jsdom'

    fetchIndex: (func) =>
        @request @url, (error, response, body) =>
            if not error and response.statusCode < 300
                func error, response, body
            else
                console.error "fetch '#{@url}' failed."

    setupJquery: (body) =>
        # parse the html and create a dom window
        window = @jsdom.jsdom body, null,
            FetchExternalResources: no
            ProcessExternalResources: no
            MutationEvents: no
            QuerySelector: no
        .createWindow()
        # apply jquery to the window
        @jquery.create window

    fetchIcons: =>
        @fetchIndex (error, response, body) =>
            $ = @setupJquery body
            for img in $('[data-image-key]')
                src = $(img).attr 'data-src'
                src ?= $(img).attr 'src'
                src = src.replace /thumb\/|\/60px-.*/g, ''
                fileName = src.match(/^.*\/([0-9]+i\.png)$/)[1].replace 'i.png', '-100.png'
                @fetchIcon src, fileName

    fetchIcon: (src, fileName) =>
        @request url: src, encoding: null, (error, response, body) =>
            @fs.writeFile "images/cards/#{fileName}", body

    fetchCards: =>
        @fetchIndex (error, response, body) =>
            $ = @setupJquery body
            $('#mw-content-text').find('a')


salmon = new Salmon()
salmon.fetchIcons()
#salmon.fetchCards()