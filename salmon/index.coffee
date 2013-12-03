
class Salmon
    constructor: (@lang, @url) ->
        # properties
        @lang ?= 'zh-TW'
        @url ?= 'http://zh.tos.wikia.com/wiki/Category:%E5%9C%96%E9%91%92'
        @origin = @url.match(/^(.*\/\/(\w|\.)+).*$/)[1]

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
                fileName = src.match(/^.*\/([0-9]+i\.png)$/)[1].replace 'i.png', '.png'
                @fetchImage src, "100/#{fileName}"

    fetchImage: (url, fileName) =>
        @request url: url, encoding: null, (error, response, body) =>
            @fs.writeFile "images/cards/#{fileName}", body

    fetchCards: (start) =>
        cards = {}
        @fetchIndex (error, response, body) =>
            $ = @setupJquery body
            total = $('#mw-content-text a').length
            for index in [start...$('#mw-content-text a').length] by 1
                link = $('#mw-content-text a')[index]
                @fetchCard "#{@origin}#{$(link).attr('href')}", cards, total

    fetchCard: (url, pool, total) =>
        @request url, (error, response, body) =>
            $ = @setupJquery body
            id = $($('.wikitable tr')[1]).find('td:first').text().replace /\s/g, ''
            name = $($('.wikitable tr')[0]).find('td').text().replace /\s/g, ''
            pool[id] =
                name: name
            if Object.keys(pool).length is total
                console.log 'done'
            @fetchImage $('#mw-content-text img:first').attr('src'), "600/#{id}.png"


salmon = new Salmon()
#salmon.fetchIcons()
salmon.fetchCards 0