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
            ee: 'Evolve Elements'
            lue: 'Level Up Elements'


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
            dragon: '龍類'
            beast: '獸類'
            elf: '妖精'
            god: '神族'
            fiend: '魔族'
            ee: '強化素材'
            lue: '進化素材'


    # ----------------------------------------
    # $get
    # ----------------------------------------
    @get = ->
        resource: @resource
    @$get = @get
    return
