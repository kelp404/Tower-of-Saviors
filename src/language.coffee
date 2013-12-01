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


    # ----------------------------------------
    # $get
    # ----------------------------------------
    @get = ->
        resource: @resource
    @$get = @get
    return
