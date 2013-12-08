
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
            end ?= total - 1
            end = total - 1 if end >= total
            for index in [start..end] by 1
                link = $('#mw-content-text a')[index]
                @fetchCard "#{@origin}#{$(link).attr('href')}", cards, end - start + 1

    fetchCard: (url, pool, total) =>
        @request url, (error, response, body) =>
            $ = @setupJquery body
            id = $($('.wikitable tr')[1]).find('td:first').text().trim()
            name = $($($('.wikitable tr')[0]).find('td')[1]).text().trim()
            race = @bleachRace $($($('.wikitable tr')[1]).find('td')[3]).text().trim()
            attribute = @bleachAttribute $($($('.wikitable tr')[0]).find('td')[2]).text().trim()
            if race is 'error' or attribute is 'error'
                console.log "======= error ======= #{id}"
            species = $($($('.wikitable tr')[1]).find('td')[4]).text().trim()
            rarity = parseInt $($($('.wikitable tr')[1]).find('td')[1]).text()
            cost = parseInt $($($('.wikitable tr')[1]).find('td')[2]).text()
            properties =
                lvMin:
                    lv: 1
                    hp: parseInt $($($('.wikitable tr')[4]).find('td')[0]).text()
                    attack: parseInt $($($('.wikitable tr')[4]).find('td')[1]).text()
                    recovery: parseInt $($($('.wikitable tr')[4]).find('td')[2]).text()
                    total: parseInt $($($('.wikitable tr')[4]).find('td')[3]).text()
                lvMax:
                    lv: parseInt $($($('.wikitable tr')[2]).find('td')[0]).text()
                    hp: parseInt $($($('.wikitable tr')[5]).find('td')[0]).text()
                    attack: parseInt $($($('.wikitable tr')[5]).find('td')[1]).text()
                    recovery: parseInt $($($('.wikitable tr')[5]).find('td')[2]).text()
                    total: parseInt $($($('.wikitable tr')[5]).find('td')[3]).text()
            activeSkill =
                name: $($($('.wikitable tr')[6]).find('td')[1]).text().trim()
                description: $($($('.wikitable tr')[7]).find('td')[0]).text().trim()
                cd:
                    ori: $($($('.wikitable tr')[6]).find('td')[2]).text().trim()
                    min: $($($('.wikitable tr')[6]).find('td')[3]).text().trim()
            leaderSkill =
                name: $($($('.wikitable tr')[8]).find('td')[1]).text().trim()
                description: $($($('.wikitable tr')[9]).find('td')[0]).text().trim()
            evolve =
                origin: null
                resources: []
                result: null
            origin =
                friendPointSeal: no
                diamondSeal: no
                others: []
                levels: []
            if race is 'element'
                origin.friendPointSeal = $($($('.wikitable tr')[10]).find('td')[1]).text().trim() is '有'
                origin.diamondSeal = $($($('.wikitable tr')[10]).find('td')[2]).text().trim() is '有'
                origin.others = do ->
                    links = $($($('.wikitable tr')[10]).find('td')[3]).find('a')
                    return [] if links.length is 0
                    $(x).text().trim() for x in links
                origin.levels = do ->
                    links = $($($('.wikitable tr')[11]).find('td')[0]).find('a')
                    return [] if links.length is 0
                    $(x).text().trim() for x in links
            else
                origin.friendPointSeal = $($($('.wikitable tr')[11]).find('td')[1]).text().trim() is '有'
                origin.diamondSeal = $($($('.wikitable tr')[11]).find('td')[2]).text().trim() is '有'
                origin.others = do ->
                    links = $($($('.wikitable tr')[11]).find('td')[3]).find('a')
                    return [] if links.length is 0
                    $(x).text().trim() for x in links
                origin.levels = do ->
                    links = $($($('.wikitable tr')[12]).find('td')[0]).find('a')
                    return [] if links.length is 0
                    $(x).text().trim() for x in links

            pool[id] =
                id: id
                name: name
                imageSm: "images/cards/100/#{id}.png"
                imageMd: "images/cards/600/#{id}.png"
                race: race
                attribute: attribute
                species: species
                rarity: rarity
                cost: cost
                properties: properties
                activeSkill: activeSkill
                leaderSkill: leaderSkill
                evolve: evolve
                origin: origin

            @writeCardCoffee pool[id]
            @fetchImage $('#mw-content-text img:first').attr('src'), "600/#{id}.png"

            if Object.keys(pool).length is total
                @writeCardsCoffee pool

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

    writeCardCoffee: (card) =>
        originOthers = ''
        if card.origin.others.length > 0
            originOthers = "'#{card.origin.others.join('\', \'')}'"
        originLevels = ''
        if card.origin.levels.length > 0
            originLevels = "'#{card.origin.levels.join('\', \'')}'"
        coffee =
            """
            id: #{card.id * 1}
            name: '#{card.name}'
            imageSm: '#{card.imageSm}'
            imageMd: '#{card.imageMd}'
            race: '#{card.race}'
            attribute: '#{card.attribute}'
            species: '#{card.species}'
            rarity: #{card.rarity}
            cost: #{card.cost}
            properties:
                lvMin:
                    lv: #{card.properties.lvMin.lv}
                    hp: #{card.properties.lvMin.hp}
                    attack: #{card.properties.lvMin.attack}
                    recovery: #{card.properties.lvMin.recovery}
                    total: #{card.properties.lvMin.total}
                lvMax:
                    lv: #{card.properties.lvMax.lv}
                    hp: #{card.properties.lvMax.hp}
                    attack: #{card.properties.lvMax.attack}
                    recovery: #{card.properties.lvMax.recovery}
                    total: #{card.properties.lvMax.total}
            activeSkill:
                name: '#{card.activeSkill.name}'
                description: '#{card.activeSkill.description}'
                cd:
                    ori: #{card.activeSkill.cd.ori}
                    min: #{card.activeSkill.cd.min}
            leaderSkill:
                name: '#{card.leaderSkill.name}'
                description: '#{card.leaderSkill.description}'
            evolve:
                origin: #{card.evolve.origin}
                resources: [#{card.evolve.resources.join(', ')}]
                result: #{card.evolve.result}
            origin:
                friendPointSeal: #{if card.origin.friendPointSeal then 'yes' else 'no'}
                diamondSeal: #{if card.origin.diamondSeal then 'yes' else 'no'}
                others: [#{originOthers}]
                levels: [#{originLevels}]
            """
        @fs.writeFile "data/#{@lang}/cards/_source/#{card.id * 1}.coffee", coffee

    updateData: =>
        total = 448
        pool = {}
        for id in [1..448]
            @fetchLocalData id, pool, total
    fetchLocalData: (cardId, pool, total) =>
        @request "#{@url}/#{cardId}.min.js", (error, response, body) =>
            if not error and response.statusCode < 300
                pool[cardId] = eval body
                pool[cardId].species = @bleachSpecies pool[cardId].species
            else
                pool[cardId] =
                    name: null
                    imageSm: 'images/cards/100/000.png'
                    race: null
                    attribute: null
                    species: null

            if Object.keys(pool).length is total
                console.log 'done'
                coffee = ''
                ids = Object.keys(pool).sort (a, b) -> a - b
                for id in ids
                    card = pool[id]
                    coffee +=
                        """
                        #{id}:
                            name: '#{card.name}'
                            imageSm: '#{card.imageSm}'
                            race: '#{card.race}'
                            attribute: '#{card.attribute}'
                            species: '#{card.species}'

                        """
                @fs.writeFile "data/#{@lang}/cards.coffee", coffee


    bleachSpecies: (source) ->
        species = source
        switch source
            when '主角', 'Main Character'
                species = 'main'
            when '中國神獸', 'Chinese Beast'
                species = 'chineseBeast'
            when '防龍', 'Defensive Dragon'
                species = 'defensiveDragon'
            when '地精', 'Gnome'
                species = 'gnome'
            when '精靈', 'Elf'
                species = 'elf'
            when '蜥蜴', 'Salamander'
                species = 'salamander'
            when '魔女', 'Witch'
                species = 'witch'
            when '史萊姆', 'Slime'
                species = 'slime'
            when '狼人', 'Wolf'
                species = 'wolf'
            when '命運女神', 'Moirai Sister'
                species = 'moiraSister'
            when '遊俠', 'Paladin'
                species = 'paladin'
            when '巨像'   # Gnome
                species = 'colossus'
            when '機械獸', 'Metallic Beast'
                species = 'metallicBeast'
            when '西方獸', 'Cthulhu Beast'
                species = 'cthulhuBeast'
            when '希臘神', 'Greek Gods'
                species = 'greekGod'
            when '北歐神', 'Northern European God'
                species = 'northernEuropeanGod'
            when '埃及神', 'Egyptian God'
                species = 'egyptianGod'
            when '西遊神', 'Journey West God'
                species = 'journeyWestGod'
            when '機械龍', 'Metallic Dragon'
                species = 'metallicDragon'
            when '元素', 'Evolve Elements', '進化素材', 'Special Evolve Elements'
                species = 'evolveElements'
            when '靈魂石', 'LevelUp Elements'
                species = 'soulStone'
            when '封王', 'Special Boss'
                species = 'boss'
            when '妖女', 'Fairy'
                species = 'fairy'
            when '異界龍', 'Cthulhu Dragon'
                species = 'cthulhuDragon'
            when '石像', 'Stone'
                species = 'stone'
            when '巫女', 'Hex'
                species = 'hex'
            when '貓公爵系列', 'Cat Duke'
                species = 'catDuke'
            when '黃道十二宮', 'Constellation'
                species = 'constellation'
            when '星靈', 'Star'
                species = 'star'
            when '小丑', 'Clown'
                species = 'clown'
            when '不死魔族', 'Undead'
                species = 'Undead'
            when '希臘妖獸', 'Greek Beast'
                species = 'Greek Beast'
            when '龍使', 'Dragon Envoy'
                species = 'dragonEnvoy'
            when 'B.Duck'
                species = 'duck'
            else
                console.log species
                species = 'error'
        species

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
                console.log race
                race = 'error'
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
                console.log attribute
                attribute = 'error'
        attribute


salmon = new Salmon 'zh-TW', 'http://localhost:8000/data/zh-TW/cards'
salmon.updateData()
#salmon.fetchIcons()
#salmon.fetchCards 424, 424