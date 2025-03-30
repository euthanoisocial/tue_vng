//global variable sPromotionContent

class ContentModule {

    sideBannerSelector = 'pm__side_banner';
    rankAllSelector = '.pm__menu-rank';
    rankServerSelector = '.pm__menu-rankserver';
    listRewardSelector = '.pm__list-win-reward';
    featureSelecture = {
        featureWrapper: "#Feature",
        listFeature : "#pm__list-feature-group",
        featureComponent : null,
        functionInitSwipperFeature: null
    }
    backgroundHeaderSelector = {
        pc    : ".pm__header_bg_img_pc",
        mb    : ".pm__header_bg_img_mb",
        video : ".pm__header_bg_video",
        wrapper: ".pm__section-header"
    };
    promotionContent = JSON.parse(arrContent);

    keyClassMapping = {
        //link
        "LINK": {
            "CONTENT_FACEBOOK_LINK": "pm__content_facebook",
            "CONTENT_INSTAGRAM_LINK": 'pm__content_instagram',
            "CONTENT_TIKTOK_LINK": 'pm__content_tiktok',
            "CONTENT_YOUTUBE_LINK": 'pm__content_youtube',
            "CONTENT_HOME_LINK": 'pm__content_home',
            "CONTENT_APP_STORE_LINK": "pm__app_store_link",
            "CONTENT_CH_PLAY_LINK": "pm__app_ch_play_link",
            "CONTENT_DOWNLOAD_APK_LINK": "pm__download_apk",
            "CONTENT_DOWNLOAD_ONE_LINK": "pm__download_one_link",
            "CONTENT_VIDEO_PRE_REGISTER_LINK" : "pm__content_video_link_register",
            "CONTENT_VIDEO_BIRTHDAY_CAKE_LINK" : "pm__video-birth-day-cake"
        },
        "LOCALIZE":{
            "gift_history" : "pm__exchange_history_title",
            "LUCKY_DRAW_HISTORY" : "pm__distribute_code_history_title",
            "LOGIN_POPUP_TITLE" : 'pm__login_popup_title',
            "CONDITION_LIST_POPUP_TITLE" : 'pm__condition_list_popup_title',
            "RULE_POPUP_TITLE" : 'pm__rule_popup_title',
            "TEXT_BUTTON_LOGIN" : 'pm__text_login_btn',
            "TEXT_BUTTON_RETYPE" : 'pm__text_retype_btn',
            "TEXT_TITLE_REGISTER_POPUP": 'pm__text_register_popup',
            "TEXT_GET_POINT" : 'pm__text_get_point',
            "logout" : 'pm__logout',
            "login" : 'pm__login',
            "CONDITION_NUMBER_OF_POINT": 'pm__number_of_point',
            "hello" : "pm__text-hello",
            "text_off" : "pm__text-off",
            "text_received" : "pm__text-received",
            "text_active" : "pm__text-active",
            "full_name" : "pm__text_fullname",
            "address" : "pm__text_address",
            "female" : "pm__text_female",
            "male" : "pm__text_male",
            "phone_number" : "pm__text_phone",
            "get_otp" : "pm__text_get_otp",
            "email" : "pm__text_email",
            "birthday" : "pm__text_birthday",
            "id_number" : "pm__text_identity_number",
            "server" : "pm__text_server",
            "select_server" : "pm__text_select_server",
            "character" : "pm__text_character",
            "select_character" : "pm__text_select_character",
            "select_gender" : "pm__text_select_gender",
            "family_name" : "pm__text_family_name",
            "agree" : "pm__text_agree",
            "TEXT_CREATE_NEW_ACCOUNT" : "pm__text_create_now",
            "select_account_login" : "pm__text_select_account_login",
            'login_with_zing_id' : 'pm__zing',
            'login_with_apple' : 'pm__appleid',
            'login_with_google' : 'pm__google',
            'login_with_playnow' : 'pm__email',
            'login_with_facebook' : 'pm__facebook',
            'captcha_code_enter' : 'pm__text_captcha_code_enter',
            'LUCKY_DRAW_GIFT_EXCHANGE_RANK_TURN_ALL' : 'pm__text-title-rank-all',
            'LUCKY_DRAW_GIFT_EXCHANGE_RANK_TURN_SERVER' : 'pm__text-title-rank-server',
            'PROFILE_SELECT_ROLE' : 'pm__text-select-role',
            'PROFILE_CHANGE_ROLE' : 'pm__changerole',
            'LUCKY_DRAW_GIFT_EXCHANGE_TOTAL_EXCHANGE_AVAILABLE':'pm__total_exchange_available',
            'LUCKY_DRAW_GIFT_EXCHANGE_TOTAL_TURN_AVAILABLE':'pm__total_turn_available',
            'LUCKY_DRAW_GIFT_EXCHANGE_TOTAL_TURN_USED':'pm__total_turn_used',
            'PROFILE_FIELD_OS':'pm__text_os'
        }
    }

    constructor() {
        this.assignDefaultVariable();
        this.hideUnUseComponent();
        this.initContent();
        this.translateContent();
        this.processRankingBtn();
        this.showListWinReward();
        this.innitHeader();
        this.innitSlideFeature();
        setTimeout(function(){
            window.dispatchEvent(new Event('resize'));
        },1000);
    }

    assignDefaultVariable(){
        if(typeof itemMediaSliderComponent != 'undefined' && typeof innitSwipperFeature != 'undefined'){
            this.featureSelecture.featureComponent = itemMediaSliderComponent;
            this.featureSelecture.functionInitSwipperFeature = innitSwipperFeature;
        }
    }

    innitSlideFeature() {

        let isShowFeature = false;
        let listMediaFeture = [];

        this.promotionContent.forEach(function (content, index) {
            if(content['ContentType'] === "SETTING"){
                if(content['Content']['SHOW_SLIDE_SHOW'] === '1'){
                    isShowFeature = true;
                    listMediaFeture = content['Content']['MEDIA_FRAME_FETURE'];
                }
            }
        });

        if(isShowFeature){
            let listFeature = [];
            var that = this;
            if (typeof listMediaFeture != "undefined"){
                listMediaFeture.forEach(function(item,index){
                    listFeature.push(that.featureSelecture.featureComponent(item.LINK_IMAGE,item.LINK_VIDEO));
                });
                $(this.featureSelecture.listFeature).empty();
                $(this.featureSelecture.listFeature).append(listFeature.join(""));
            }else{
                $(this.featureSelecture.listFeature).empty();
            }

            $(this.featureSelecture.featureWrapper).css("display","block");
            this.featureSelecture.functionInitSwipperFeature();
        }

    }
    innitHeader(){
        let isShowHeader = false;
        let isShowVideoHeader = false;

        this.promotionContent.forEach(function (content, index) {
            if(content['ContentType'] === "SETTING"){
                if(content['Content']['SHOW_FRAME_HEADER'] === '1'){
                    isShowHeader = true;
                }
                if(content['Content']['SHOW_VIDEO_FRAME_HEADER']==='1'){
                    isShowVideoHeader = true;
                }
            }
        });

        if(isShowHeader){
            if(isShowVideoHeader){
                $(this.backgroundHeaderSelector.video).attr("src",sStaticDomain+"/images/frame-header/video-frame-header.mp4");
            }else{
                $(this.backgroundHeaderSelector.video).remove();
            }
            $(this.backgroundHeaderSelector.mb).attr("src",sStaticDomain+"/images/frame-header/frame-header-mb.jpg");
            $(this.backgroundHeaderSelector.pc).attr("src",sStaticDomain+"/images/frame-header/frame-header.jpg");
            $(this.backgroundHeaderSelector.wrapper).css("display","block");
            let tmpVideo = $(`${this.backgroundHeaderSelector.wrapper} video`)[0];
            tmpVideo.load();
            tmpVideo.addEventListener('loadeddata', function() {
                setTimeout(function(){
                    window.dispatchEvent(new Event('resize'));
                },5000);
            }, false);
        }else{
            $(this.backgroundHeaderSelector.wrapper).remove();
        }

    }

    showListWinReward(){
        let sArrReward = $(`${this.listRewardSelector} marquee`).text();
        if(sArrReward != ''){
            $(`${this.listRewardSelector} marquee`).parent().html(`<marquee>${sArrReward}</marquee>`);
            $(this.listRewardSelector).css("display","block");
        }
    }

    translateContent() {
        for(let langKey in this.keyClassMapping["LOCALIZE"]){
            let classSelector = this.keyClassMapping["LOCALIZE"][langKey];
            let replaceContent = dict(langKey);
            if (replaceContent) {
                let element = $(`.${classSelector}`);
                element.text(replaceContent);
            }
            if(classSelector == 'pm__text_captcha_code_enter'){
                $(`.${classSelector}`).attr('placeholder',replaceContent);
            }
        }
    }

    initContent() {
        var that = this;
        this.promotionContent.forEach(function (content, index) {
            let isShowSideBanner = false;
            switch (content['ContentType']) {

                case 'LINK':
                    for (let keyDetail in content['Content']) {
                        let classSelector = that.keyClassMapping[content['ContentType']][keyDetail];
                        let replaceContent = content["Content"][keyDetail];
                        if (replaceContent) {
                            let element = $(`a.${classSelector}`);
                            element.attr("href", replaceContent);
                            element.show();
                            if(["CONTENT_VIDEO_PRE_REGISTER_LINK","CONTENT_VIDEO_BIRTHDAY_CAKE_LINK"].includes(keyDetail)){
                                element.css('opacity',1);
                            }
                            if(!["CONTENT_VIDEO_PRE_REGISTER_LINK","CONTENT_VIDEO_BIRTHDAY_CAKE_LINK"].includes(keyDetail)){
                                isShowSideBanner = true;
                            }
                        }
                    }
                    break;
            }
            if (isShowSideBanner) {
                $(`.${that.sideBannerSelector}`).show();
            }
        });
    }

    showFirstHideOther(sClass){

        let arElement = $(sClass);
        for(let i=0; i< arElement.length ; i++){
            if(i > 0 ){
                $(arElement[i]).hide();
            }
        }

    }

    hideUnUseComponent() {
        //hide link button

        for (let keyContentDetail in this.keyClassMapping['LINK']) {
            let classSelector = this.keyClassMapping['LINK'][keyContentDetail];
            if(['CONTENT_VIDEO_PRE_REGISTER_LINK','CONTENT_VIDEO_BIRTHDAY_CAKE_LINK'].includes(keyContentDetail)){
                $(`a.${classSelector}`).css('opacity',0);
            }else {
                $(`a.${classSelector}`).hide();
            }
        }


        //hide main banner
        $(`.${this.sideBannerSelector}`).hide();

        //hide duplicate user info
        this.showFirstHideOther(".pm__user_info");

        //hide unuse button show condition
        this.showFirstHideOther(".pm__show-condition-list");

        //hide unuse button show rule
        this.showFirstHideOther(".pm__show_rule");

    }

    processRankingBtn(){
        if(typeof isShowRank != 'undefined' ){
            switch (isShowRank){
                case '1':
                    $(this.rankServerSelector).css("display","block");
                    break;
                case '2':
                    $(this.rankAllSelector).css("display","block");
                    break;
                default:
                    $(this.rankAllSelector).hide();
                    $(this.rankServerSelector).hide();
            }
        }

    }
}

$(document).ready(function () {
    new ContentModule();
})
