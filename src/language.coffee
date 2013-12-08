a = angular.module 'tos.languageResource', []

a.provider '$lan', ->
    # ----------------------------------------
    # properties
    # ----------------------------------------
    @resource =
        # ----------------------------------------
        # English
        # ----------------------------------------
        en:
            light: 'Light'
            dark: 'Dark'
            water: 'Water'
            fire: 'Fire'
            wood: 'Wood'
            human: 'Human'

            dragon: 'Dragon'
            beast: 'Beast'
            elf: 'Elf'
            god: 'God'
            fiend: 'Fiend'
            element: 'Element'

            hp: 'HP'
            attack: 'Attack'
            recovery: 'Recovery'
            total: 'Total'

            race: 'Race'
            attribute: 'Attribute'
            cost: 'Cost'
            species: 'Species'
            rarity: 'Rarity'
            activeSkill: 'Active Skill'
            leaderSkill: 'Leader Skill'
            origin: 'Origin'
            friendPointSeal: 'Friend Point Seal'
            diamondSeal: 'Diamond Seal'
            levels: 'Levels'
            others: 'Others'

            main: 'Main Character'
            chineseBeast: 'Chinese Beast'
            defensiveDragon: 'Defensive Dragon'
            gnome: 'Gnome'
            # elf: 'Elf'
            salamander: 'Salamander'
            witch: 'Witch'
            slime: 'Slime'
            wolf: 'Wolf'
            moiraSister: 'Moirai Sister'
            paladin: 'Paladin'
            colossus: 'Colossus'
            metallicBeast: 'Metallic Beast'
            cthulhuBeast: 'Cthulhu Beast'
            greekGod: 'Greek Gods'
            northernEuropeanGod: 'Northern European God'
            egyptianGod: 'Egyptian God'
            journeyWestGod: 'Journey West God'
            metallicDragon: 'Metallic Dragon'
            evolveElements: 'Evolve Elements'
            soulStone: 'soulStone'
            boss: 'Special Boss'
            fairy: 'Fairy'
            cthulhuDragon: 'Cthulhu Dragon'
            stone: 'Stone'
            hex: 'Hex'
            catDuke: 'Cat Duke'
            constellation: 'Constellation'
            star: 'Star'
            clown: 'Clown'
            undead: 'Undead'
            greekBeast: 'Greek Beast'
            dragonEnvoy: 'Dragon Envoy'
            duck: 'B.Duck'
            otherSpecies: 'Others'

        # ----------------------------------------
        # Chinese
        # ----------------------------------------
        'zh-TW':
            light: '光'
            dark: '暗'
            water: '水'
            fire: '火'
            wood: '木'

            human: '人類'
            dragon: '龍族'
            beast: '獸族'
            elf: '妖精'
            god: '神族'
            fiend: '魔族'
            element: '素材'

            hp: '生命'
            attack: '攻擊'
            recovery: '回復'
            total: '總計'

            race: '種族'
            attribute: '屬性'
            cost: '空間'
            species: '系列'
            rarity: '稀有'
            activeSkill: '主動技'
            leaderSkill: '隊長技'
            origin: '來源'
            friendPointSeal: '友情抽獎'
            diamondSeal: '魔法石抽獎'
            levels: '關卡'
            others: '其他'

            main: '主角'
            chineseBeast: '中國神獸'
            defensiveDragon: '防龍'
            gnome: '地精'
            # elf: '妖精'
            salamander: '蜥蜴'
            witch: '魔女'
            slime: '史萊姆'
            wolf: '狼人'
            moiraSister: '命運女神'
            paladin: '遊俠'
            colossus: '巨像'
            metallicBeast: '機械獸'
            cthulhuBeast: '西方獸'
            greekGod: '希臘神'
            northernEuropeanGod: '北歐神'
            egyptianGod: '埃及神'
            journeyWestGod: '西遊神'
            metallicDragon: '機械龍'
            evolveElements: '素材'
            soulStone: '靈魂石'
            boss: '封王'
            fairy: '妖女'
            cthulhuDragon: '異界龍'
            stone: '石像'
            hex: '巫女'
            catDuke: '貓公爵系列'
            constellation: '黃道十二宮'
            star: '星靈'
            clown: '小丑'
            undead: '不死魔族'
            greekBeast: '希臘妖獸'
            dragonEnvoy: '龍使'
            duck: 'B.Duck'
            otherSpecies: '未歸類'

    # ----------------------------------------
    # $get
    # ----------------------------------------
    @get = ->
        resource: @resource
    @$get = @get
    return
