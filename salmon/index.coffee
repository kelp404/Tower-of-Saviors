
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

    fetchCards: (start, end) =>
        cards = {}
        @fetchIndex (error, response, body) =>
            $ = @setupJquery body
            total = $('#mw-content-text a').length
            for index in [start..end] by 1 when index < total
                link = $('#mw-content-text a')[index]
                @fetchCard "#{@origin}#{$(link).attr('href')}", cards, end - start + 1

    fetchCard: (url, pool, total) =>
        @request url, (error, response, body) =>
            $ = @setupJquery body
            id = $($('.wikitable tr')[1]).find('td:first').text().trim()
            name = $($($('.wikitable tr')[0]).find('td')[1]).text().trim()
            race = $($($('.wikitable tr')[1]).find('td')[3]).text().trim()
            attribute = $($($('.wikitable tr')[0]).find('td')[2]).text().trim()

            pool[id] =
                name: name
                imageSm: "images/cards/100/#{id}.png"
                race: @bleachRace race
                attribute: @bleachAttribute attribute
            if Object.keys(pool).length is total
                @writeCardsCoffee pool
#            @fetchImage $('#mw-content-text img:first').attr('src'), "600/#{id}.png"

    writeCardsCoffee: (cards) =>
        coffee = ''
        ids = Object.keys(cards).sort()
        for id in ids
            card = cards[id]
            coffee +=
                """
                #{id * 1}:
                    name: '#{card.name}'
                    imageSm: '#{card.imageSm}'
                    race: '#{card.race}'
                    attribute: '#{card.attribute}'

                """
        @fs.writeFile "data/#{@lang}/cards.coffee", coffee
        console.log "written #{Object.keys(cards).length} items."

    bleachRace: (source) ->
        race = source
        switch source.toLowerCase()
            when 'human', '人類'
                race = 'human'
            when 'dragon', '龍族', '龍類'
                race = 'dragon'
            when 'beast', '獸族', '獸類'
                race = 'beast'
            when 'elf', '妖精', '妖精類'
                race = 'elf'
            when 'god', '神族'
                race = 'god'
            when 'fiend', '魔族'
                race = 'fiend'
            when '強化素材', '進化素材'
                race = 'element'
            else
                console.error "bleach race failed: #{race}"
        race

    bleachAttribute: (source) ->
        attribute = source
        switch source.toLowerCase()
            when 'light', '光'
                attribute = 'light'
            when 'dark', '暗'
                attribute = 'dark'
            when 'water', '水'
                attribute = 'water'
            when 'fire', '火'
                attribute = 'fire'
            when 'wood', '木'
                attribute = 'wood'
            else
                console.error "bleach attribute failed: #{source}"
        attribute


salmon = new Salmon()
#salmon.fetchIcons()
salmon.fetchCards 0, 50