let LuckyDrawExchangeModuleV3 = {
    exec_start: false,
    usedPoint: 0,
    popupConfirmExchange: null,

    async fetchViewData() {
        let me = this;

        return await $.ajax({
            type: "POST",
            url: mainProgramUrl + '/fetch-view-data',
            dataType: 'json',
            data: {},
            success: function (response) {
                if (response.status == 1) {
                    cpInGame = response.data.cpInGame;
                    sPoint = response.data.sPoint;
                    sTotalPoint = response.data.sTotalPoint;
                    arGiftExchangeConfigType = response.data.arGiftExchangeConfigType;
                    arPackageQuantityNeed = response.data.arPackageQuantityNeed;
                    arPackageQuantityAvailable = response.data.arPackageQuantityAvailable;
                    arPackageExchangeStatus = response.data.arPackageExchangeStatus;
                    arPackageTimesLimit = response.data.arPackageTimesLimit;
                    arPackageImage = response.data.arPackageImage;
                    arPackageDetailImage = response.data.arPackageDetailImage;
                    arPackageExchanged = response.data.arPackageExchanged;
                    arMilestones = response.data.arMilestones;
                    sTotalPackageTypeExchangeAvailable = response.data.sTotalPackageTypeExchangeAvailable;
                    isSwitchPool = response.data.isSwitchPool;
                    aItemNumInfo = response.data.aItemNumInfo;
                    pointConfigForTurn = response.data.pointConfigForTurn;
                    arrPackageWin = response.data.arrPackageWin;
                    currentPool = response.data.currentPool;
                    currentTurn = response.data.currentTurn;
                    arrPackageInPool = response.data.arrPackageInPool;
                    arPackageExchangedDetail = response.data.arPackageExchangedDetail;

                    $(".pm__cp-ingame").html(cpInGame);

                    me.initLogin();

                    me.exchangeMilestones();
                    me.displayListWinRewards();
                    if(typeof configLucky !== 'undefined') {
                        me.initItemLuckyDraw();
                    };
                    if (typeof afterFetchViewData != 'undefined' && typeof afterFetchViewData == 'function') {
                        afterFetchViewData();
                    }
                }
            },
            error: function (response) {

            }
        });
    },

    initLogin() {
        this.initState();
        this.initPackagesStatus();

        this.exchangeItemFromItems();
        this.exchangeItemCollection();
    },

    init() {
        if(typeof configLucky !== 'undefined') {
            this.initItemLuckyDraw();
        };
        this.popupConfirmExchange = $('.pm__popup-confirm-exchange');
        this.confirmExchangeItem();

        this.initModule();
        this.initMenu();
        if (isLogin === 1) {
            arGiftExchangeConfigType = JSON.parse(arGiftExchangeConfigType);
            arPackageQuantityNeed = JSON.parse(arPackageQuantityNeed);
            arPackageQuantityAvailable = JSON.parse(arPackageQuantityAvailable);
            arPackageImage = JSON.parse(arPackageImage);
            arPackageDetailImage = JSON.parse(arPackageDetailImage);
            arPackageExchangeStatus = JSON.parse(arPackageExchangeStatus);
            arPackageTimesLimit = JSON.parse(arPackageTimesLimit);
            arPackageExchanged = JSON.parse(arPackageExchanged);
            arPackageExchangedDetail = JSON.parse(arPackageExchangedDetail);
            this.initLogin();
        } else {
            $('.pm__login, .pm__menu-login a').attr('href', baseURL);
            $('a.pm__logout').closest('li').remove();
            $('.pm__menu-selectrole, .pm__logout').remove();
        }
        this.exchangeMilestones();
        this.displayListWinRewards();
    },
    initModule() {
        let pm__module = $(".pm__module");
        let pm__module_container = $(".pm__module-container");
        if (module !== 'pm__luckydrawgiftexchange-module') {
            pm__module_container.addClass('active');
            pm__module_container.show();
        }
        pm__module.addClass('active');
        pm__module.not("." + module).remove();

        if (flash_msg !== '') {
            inform(flash_msg);
        }

        // fill static content
        staticContent?.map(x => $(x.selector).html(x.value))
    },
    initMenu() {
        menu = JSON.parse(menu);

        for (let i in menu) {
            switch (i) {
                case 'PROFILE':
                    $('.pm__menu-profile a, a.pm__menu-profile').attr('href', menu[i].uri);
                    $('.pm__menu-profile-update a, a.pm__menu-profile-update').attr('href', menu[i].uri + '?update');
                    break;
                case 'CONDITION_DATE':
                    $('.pm__menu-date a, a.pm__menu-date').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_AFTER_TIME_INTERVAL':
                    $('.pm__menu-afterinterval a, a.pm__menu-afterinterval').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_QUIZ':
                    $('.pm__menu-quiz a, a.pm__menu-quiz').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_FACEBOOK':
                    $('.pm__menu-share a, a.pm__menu-share').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_ROLE':
                    $('.pm__menu-level a, a.pm__menu-level').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_INVITE':
                    $('.pm__menu-invite a, a.pm__menu-invite').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_INVITE_CODE':
                    $('.pm__menu-invitecode a, a.pm__menu-invitecode').attr('href', menu[i].uri);
                    break;
                case 'GET_EACH_CHARGE_FIXED_CASH':
                case 'GET_EACH_CHARGE_RANGE_CASH':
                    $('.pm__menu-cash a, a.pm__menu-cash').attr('href', menu[i].uri);
                    break;
                case 'GET_TOTAL_FIXED_CASH':
                case 'GET_TOTAL_RANGE_CASH':
                    $('.pm__menu-totalcash a, a.pm__menu-totalcash').attr('href', menu[i].uri);
                    break;
                case 'GET_EXCHANGE_POINT':
                    $('.pm__menu-exchangepoint a, a.pm__menu-exchangepoint').attr('href', menu[i].uri);
                    break;
                case 'HISTORY':
                    $('.pm__menu-history a, a.pm__menu-history').attr('href', menu[i].uri);
                    $('.pm__menu-history-all a, a.pm__menu-history-all').attr('href', menu[i].uri + '?all');
                    break;
                case 'RANK':
                    $('.pm__menu-rank a, a.pm__menu-rank').attr('href', menu[i].uri);
                    break;
                case 'RANK_SERVER':
                    $('.pm__menu-rankserver a, a.pm__menu-rankserver').attr('href', menu[i].uri);
                    break;
                case 'CONDITION_ALL':
                    $('.pm__menu-allcondition a, .pm__menu-condition a, a.pm__menu-allcondition, a.pm__menu-condition').attr('href', menu[i].uri);
                    $(".pm__menu-allcondition-history a, a.pm__menu-allcondition-history").attr('href', menu[i].uri + '/history');
                    break;
                case 'SELECT_ROLE':
                    $('.pm__menu-selectrole a, a.pm__menu-selectrole').attr('href', menu[i].uri);
                    break;
                case 'GIFT_RETRY':
                    $('.pm__menu-giftretry a, a.pm__menu-giftretry').attr('href', menu[i].uri);
                    break;
            }
        }
    },
    initState() {
        $(".pm__userid").html(`<a class="click2copy click2copyUserID" data-value="${userid}" onclick="_click2copy(this)">${userid}</a>`);
        $(".pm__username").html('<a class="click2copy click2copyUserID" data-value="' + userid + '" onclick="_click2copy(this)">' + username + '</a>');
        $(".pm__charactername").html(charactername);
        $(".pm__point").html(sPoint);
        $(".pm__totalPoint").html(sTotalPoint);
        $(".pm__totalItemExchange").html(sTotalPackageTypeExchangeAvailable);
        this.usedPoint = sTotalPoint - sPoint;
        $(".pm__usedPoint").html(this.usedPoint);
        // $(".pm__usedPoint").html(usedPoint);
        $(".line__main .line__realtime").attr("data-point", this.usedPoint);

        $(".pm__btn-inventory").attr('href', mainProgramUrl + '/exchange');
        $(".pm__claim-history").attr('href', mainProgramUrl + '/claim-history');
        $(".pm__menu-exchange-history").attr('href', mainProgramUrl + '/exchange-history');
        $(".pm__editProfile").attr('href', editProfile);
        $(".pm__logout").attr('href', baseGameSlug + '/dang-xuat');
        $('.pm__menu-login, .pm__login').remove();
        $('.pm__login').closest('li').remove();
        $('[class*="pm__item-lucky-draw-"]').attr('data-pool', currentPool);
        $('.pm__refresh-point').attr('onclick', 'LuckyDrawExchangeModuleV3.refreshPointIngame()');
        $('.pm__number-point-for-turn').html('');
        $('.pm__type-point-for-turn').html('');
        if (isSwitchPool == 0) {
            $('.pm__switch-pool').removeAttr('onclick');
            $('.pm__switch-pool').css('pointer-events', 'none');
            $('.pm__switch-pool').css('filter', 'grayscale(100%)');
        } else {
            $('.pm__switch-pool').attr('onclick', 'LuckyDrawExchangeModuleV3.switchPool()');
            $('.pm__switch-pool').css('pointer-events', 'auto');
            $('.pm__switch-pool').css('filter', 'grayscale(0%)');

        }

        if (typeof arrPackageWin !== 'undefined') {
            if (typeof arrPackageWin === "string") {
                arrPackageWin = JSON.parse(arrPackageWin);
            }

            $('[class*="pm__item-lucky-draw-"]').removeClass('open');
            $('[class*="pm__item-lucky-draw-"]').find(".flip-card-back .item__reward").empty();
            if (typeof config !== "undefined") {
                $('.pm__coefficient').attr("src", config.urlImageCoeficientDefault);
                $('.pm__item').attr("src", config.urlImageCoeficientDefault);
            }
        }

    },
    initItemLuckyDraw() {
        if (typeof arrPackageInPool !== "undefined") {
            if (typeof arrPackageInPool === "string") {
                arrPackageInPool = JSON.parse(arrPackageInPool);
            }
            let el = $('.pm__group-item-lucky-draw');
            el.find('.draw__item').remove();
            let template = ``;
            $.each(arrPackageInPool, function (index, item) {
                template += `<div class="draw__item effect__item default__item draw__item--${configLucky.items[item.prizeCode]}" data-prizeCode="${item.prizeCode}"><img
                src="//global-mainsite.mto.zing.vn/products/metalslug/landing/2023-christmas/prod/metalslug_christmas/main__content/images/item/${configLucky.items[item.prizeCode]}.png"
                alt="">
            <p>${configLucky.names[item.prizeCode]}</p>
        </div>`;
            })
            el.find('.pm__action').before(template);
        }
        if (typeof arrPackageWin !== "undefined") {
            if (typeof arrPackageWin === "string") {
                arrPackageWin = JSON.parse(arrPackageWin);
            }
            $.each(arrPackageWin, function(index,item){
                let element = $('*[data-prizeCode="' + item.prizeCode + '"]');
                element.removeClass('default__item');
                element.addClass('off');
            }) 
        }

    },
    initPackagesStatus() {

        // reset
        $('.pm__item').removeClass('active');
        $('*[data-image]').removeClass('active received').addClass('btn-off off');
        $('.pm__item .pm__btn-claim').removeAttr('data-value');
        // show
        for (const i in arPackageImage) {
            let element = $('*[data-image="' + arPackageImage[i] + '"]');
            let elExchangeCode = $('*[data-exchangePrizeCode="' + arPackageImage[i] + '"]');
            if (element.hasClass('pm__item-lucky-draw')) {
                if (typeof arPackageQuantityAvailable[i] !== 'undefined' && parseInt(arPackageQuantityAvailable[i]) >= 1) {
                    // element.removeClass('pm__rut');
                    element.addClass('lucky-draw-received');
                }
            }
            $(`.pm__point-${arPackageImage[i]}, .pm__remain-${arPackageImage[i]}`).html(arPackageQuantityAvailable[i] || 0);
            //element.attr('title', (arPackageQuantityAvailable[i]||0) + '/' + (arPackageQuantityNeed[i]||0));
            element.attr('title', (arPackageExchanged[i] || 0) + '/' + (arPackageTimesLimit[i] || 0));
            element.attr('href', 'javascript:void(0)');

            if(typeof arPackageExchangedDetail[i] !=="undefined" && elExchangeCode.length > 0 ) {
                elExchangeCode.siblings(".pm_exchange-warning").css('display','none');
                elExchangeCode.html(arPackageExchangedDetail[i])
            }
            // over write image
            if (typeof arPackageDetailImage[i] !== 'undefined') {
                let elementImg = element.find('img.pm__main-img');
                if (elementImg.length == 0) {
                    elementImg = element.parent('.pm__package').find('.pm__main-img');
                }
                if (elementImg.length > 0) {
                    let imgSrc = elementImg.attr('src');
                    elementImg.attr('src', '');
                    if (imgSrc !== undefined) {
                        if (!imgSrc.includes(arPackageDetailImage[i] + '.png')) {
                            imgSrc = imgSrc.replace('.png', arPackageDetailImage[i] + '.png');
                            elementImg.attr('src', imgSrc);
                        } else {
                            elementImg.attr('src', imgSrc);
                        }
                    }
                }
            }

            if (typeof arPackageQuantityAvailable[i] !== 'undefined' && typeof arPackageExchangeStatus[i] === 'undefined') {
                // suu tap
                if (parseInt(arPackageQuantityNeed[i]) <= parseInt(arPackageQuantityAvailable[i])) {
                    element.removeClass('btn-off off'); // show
                    element.find('pm__btn-claim').removeClass('btn-off off');
                    element.attr('title', (arPackageQuantityAvailable[i] || 0) + '/' + parseInt(arPackageQuantityNeed[i]));
                }
                // element.attr('title', (arPackageQuantityAvailable[i]||0) + '/' + (arPackageQuantityNeed[i]||0));
            } else if (typeof arPackageExchangeStatus[i] !== 'undefined') {
                // doi
                //element.attr('title', (arPackageQuantityAvailable[i]||0) + '/' +arPackageTimesLimit[i]);
                let remain = (arPackageTimesLimit[i] - (arPackageExchanged[i] || 0)) >= 0 ? (arPackageTimesLimit[i] - (arPackageExchanged[i] || 0)) : 0;
                element.parent().find('.pm__remain').html(remain);
                let btn_claim = element.find('.pm__btn-claim');
                btn_claim.length === 0 && (btn_claim = element);
                btn_claim.removeAttr('onClick');
                if (arPackageExchangeStatus[i] === 0) {
                    btn_claim.attr('data-value', i).attr('onClick', 'LuckyDrawExchangeModuleV3.exchangeItem(this)');
                    element.addClass('pm__item active');
                    element.removeClass('btn-off off');
                }
                else if (arPackageExchangeStatus[i] === 1) {
                    element.removeClass('active');
                    element.addClass('received');
                }
                else if (arPackageExchangeStatus[i] === -1) {
                    element.removeClass('active');
                }
                else if (arPackageExchangeStatus[i] === -2) {
                    element.closest('.pm__exchange-item').remove();
                }
            } else {
                element.attr('title', (arPackageQuantityAvailable[i] || 0) + '/' + (arPackageQuantityNeed[i] || 0));
            }
        }
    },
    exchangeItem(el) {
        let me = this;
        let _this = $(el);

        let sAction = arGiftExchangeConfigType[_this.data('value')] == 2 ? 'point' : 'fixed';

        if (arGiftExchangeConfigType[_this.data('value')] == 3) {
            sAction = 'package-type-exchange';
        }

        if (me.exec_start === false) {
            me.exec_start = true;
            $.ajax({
                type: "POST",
                url: mainProgramUrl + '/exchange',
                dataType: 'json',
                data: { 'action': sAction, 'data': _this.attr('data-value') },
                success: function (response) {
                    if (response.status === 1) {
                        console.log(response);
                        me.exec_start = false;
                        _this.addClass('received').removeClass('active');
                        let customPrize = $('.pm__exchange-gift');
                        let popupRewardExchange = $('.pm__reward-exchange');
                        if (customPrize.length > 0) {
                            customPrize.addClass('active');
                            customPrize.find('.title').html(response.data);
                            customPrize.find('.pm__gift-name').html(response.name);
                        } else if (popupRewardExchange.length > 0) {
                            // let itemName = config.itemName[response.prize];
                            // let urlImage = config.directory + config.item[response.prize];
                            popupRewardExchange.addClass('active');
                            popupRewardExchange.find('.pm__exchange-code').html(response.code);
                            // popupRewardExchange.find('.pm__reward-img').attr('src', urlImage);
                        } else {
                            inform(response.data);
                        }
                        me.fetchViewData();
                        me.popupConfirmExchange.removeClass('active');

                        if (typeof afterExchangeItem === 'function') {
                            afterExchangeItem(response);
                        }
                    } else {
                        me.exec_start = false;
                        inform(response.data);
                    }
                },
                error: function (response) {
                    inform(response.data);
                }
            });
        }
    },
    exchangeItemFromItems() {
        let me = this;

        $('.pm__btn-exchange').on('click', function (e) {
            let element = $('input[name="gplid[]"]:checked');
            let count = element.length;
            if (count < 1) {
                inform('Vui lòng chọn Item để đổi.')
            } else {
                let exchangeCount = parseInt(atob($('.pm__btn-exchange').data('value')));
                let times = count / exchangeCount;
                if (count % exchangeCount !== 0) {
                    let timesExpect = parseInt(times) + 1;
                    let itemNeed = timesExpect * exchangeCount - count;
                    inform("Vui lòng chọn thêm (" + itemNeed + ") vật phẩm để đổi (" + timesExpect + ") lần.");
                } else if (me.exec_start === false) {
                    if (times > 0) {
                        let data = [];
                        element.each(function (i, object) {
                            data.push(object.dataset.value)
                        });
                        me.exec_start = true;
                        $.ajax({
                            type: "POST",
                            url: mainProgramUrl + '/exchange',
                            dataType: 'json',
                            data: { 'action': 'random', 'data': data },
                            success: function (response) {
                                if (response.status === 1) {
                                    let indexImg = response.data;
                                    let item = $('#rewardExchangeContainer .item__icon');
                                    let parent = $('#rewardExchangeContainer');
                                    parent.html('');
                                    for (let i = 0; i < indexImg.length; i++) {
                                        let tempItem = item.clone();
                                        tempItem.find('img').attr("src", window.getAwardSrcById(indexImg[i]));
                                        parent.append(tempItem);
                                    }
                                    $('#customPrize').addClass('active');
                                    me.exec_start = false;

                                    $('#customPrize .close').click(function (e) {
                                        e.preventDefault();
                                        window.location.reload();
                                    })
                                } else {
                                    me.exec_start = false;
                                    inform(response.data);
                                }
                            },
                            error: function (response) {
                                inform(response.data);
                            }
                        });
                    } else {
                        inform("Không đủ điều kiện đổi quà. Vui lòng xem thể lệ.");
                    }
                }
            }
        });
    },
    exchangeItemCollection() {
        let me = this;
        $('.pm__btn-exchange-collection').on('click', function (e) {
            let element = $('input[name="gplid[]"]:checked');
            let count = element.length;
            if (count < 1) {
                inform('Vui lòng chọn Item để đổi.')
            } else {
                let exchangeCount = parseInt(atob($('.pm__btn-exchange-collection').data('value')));
                let times = count / exchangeCount;
                if (count % exchangeCount !== 0) {
                    let timesExpect = parseInt(times) + 1;
                    let itemNeed = timesExpect * exchangeCount - count;
                    inform("Vui lòng chọn thêm (" + itemNeed + ") vật phẩm để đổi (" + timesExpect + ") lần.");
                } else if (me.exec_start === false) {
                    if (times > 0) {
                        let data = [];
                        element.each(function (i, object) {
                            data.push(object.dataset.value)
                        });
                        me.exec_start = true;
                        $.ajax({
                            type: "POST",
                            url: mainProgramUrl + '/exchange',
                            dataType: 'json',
                            data: { 'action': 'collection', 'data': data },
                            success: function (response) {
                                if (response.status === 1) {
                                    let indexImg = response.data;
                                    let item = $('#rewardExchangeContainer .item__icon');
                                    let parent = $('#rewardExchangeContainer');
                                    parent.html('');
                                    for (let i = 0; i < indexImg.length; i++) {
                                        let tempItem = item.clone();
                                        tempItem.find('img').attr("src", window.getAwardSrcById(indexImg[i]));
                                        parent.append(tempItem);
                                    }
                                    $('#customPrize').addClass('active');
                                    me.exec_start = false;

                                    $('#customPrize .close').click(function (e) {
                                        e.preventDefault();
                                        window.location.reload();
                                    })
                                } else {
                                    me.exec_start = false;
                                    inform(response.data);
                                }
                            },
                            error: function (response) {
                                inform(response.data);
                            }
                        });
                    } else {
                        inform("Không đủ điều kiện đổi quà. Vui lòng xem thể lệ.");
                    }
                }
            }
        });
    },
    claimItem() {
        let me = this;
        $('.pm__item .pm__btn-claim').on('click', function (e) {
            let element = $('input[name="gplid[]"]:checked');
            let data = [];
            if (element.length > 0 && exec_start === false) {
                element.each(function (i, object) {
                    data.push(object.dataset.value)
                });
                me.exec_start = true;
                $.ajax({
                    type: "POST",
                    url: mainProgramUrl + '/claim',
                    dataType: 'json',
                    data: { 'data': data },
                    success: function (response) {
                        if (response.status === 1) {
                            me.exec_start = false;
                            $('.pm__inform-custom .title .label').html('Nhận Quà Thành Công');
                            $('.pm__inform-custom .inform-custom-text').html(response.data);
                            $('.pm__inform-custom').addClass('active');
                            $('.pm__inform-custom .close').click(function (e) {
                                e.preventDefault();
                                window.location.reload();
                            });
                        } else {
                            me.exec_start = false;
                            inform(response.data);
                        }
                    },
                    error: function (response) {
                        inform(response.data);
                    }
                });
            } else {
                inform('Vui lòng chọn Item để nhận.')
            }
        });
    },
    exchangeMilestones() {
        let url_exchange_milestone = menu['GIFT_EXCHANGE_MILESTONES'] || null;
        if (url_exchange_milestone == null || arMilestones == null || !arMilestones) return;
        // default off
        $('.pm__milestone[data-milestone] .pm__btn-claim').attr('href', 'javascript:;').addClass('off').removeClass('active received coming-soon ended');
        $('.pm__milestone[data-milestone]').addClass('off').removeClass('active received coming-soon ended');

        let me = this;
        url_exchange_milestone = url_exchange_milestone.uri;
        $.each(arMilestones, function (key, milestones) {
            let group_milestones = null;
            let milestones_value = null;

            if (key.indexOf('TOTAL_USER_REGISTER') === 0) {
                group_milestones = $('.pm__totalregister-milestone');
                milestones_value = $('.pm__totalregister-milestone-value');
            }
            else if (key.indexOf('TOTAL_LUCKY_DRAW') === 0) {
                group_milestones = $('.pm__totaldraw-milestone');
                milestones_value = $('.pm__totaldraw-milestone-value');
            }
            else if (key.indexOf('TOTAL_MODULE_POINT') === 0) {
                group_milestones = $('.pm__totalmodule-milestone');
                // TODO chỉnh biến này khi có nhiều dạng mốc
                milestones_value = $('.pm__totalmodule-milestone-value');
            }

            milestones_value && milestones_value.html(milestones.total);

            if (!!group_milestones) {
                for (let milestone of milestones.data) {
                    let milestone_element = group_milestones.find(`.pm__milestone[data-milestone="${milestone.code}"]`);
                    let claim_btn = milestone_element.find('.pm__btn-claim');
                    switch (milestone.status) {
                        case 1: {
                            milestone_element.addClass('received').removeClass('off');
                            claim_btn.addClass('received').removeClass('off');
                            break;
                        }
                        case 0: {
                            milestone_element.addClass('active').removeClass('off');
                            claim_btn.addClass('active').removeClass('off').click(function (e) {
                                e.preventDefault();
                                if (milestone_element.hasClass('off') || milestone_element.hasClass('received')) return false;

                                me.exec_start = true;
                                $.ajax({
                                    type: "POST",
                                    url: url_exchange_milestone + '/claim',
                                    dataType: 'json',
                                    data: { 'mid': atob(milestone.id) },
                                    success: function (response) {
                                        me.exec_start = false;
                                        inform(response.data);
                                        if (response.status == 1) {
                                            milestone_element.removeClass('active').addClass('received');
                                            claim_btn.removeClass('active').addClass('received');
                                        }
                                    },
                                    error: function (response) {
                                        inform(response.data);
                                    }
                                });
                            });
                            break;
                        }
                        case -1: { milestone_element.addClass('off'); claim_btn.addClass('off'); break; }
                        case -2: { milestone_element.addClass('off coming-soon'); claim_btn.addClass('off coming-soon'); break; }
                        case -3: { milestone_element.addClass('off ended'); claim_btn.addClass('off ended'); break; }
                    }
                }
            }
        });

        $('.pm__quickclaim-milestone').click(function (e) {
            e.preventDefault();
            $('.pm__milestone[data-milestone].active .pm__btn-claim').first().click();
        })
    },

    displayListWinRewards() {
        let winRewards = $('.pm__win-rewards');
        if (winRewards.length > 0) {
            let html = '';
            for (let reward of listWinRewards) {
                html += `<div> <span>${reward.CharacterName || reward.UserID}</span> đã trúng <span>${reward.GiftPackageName}</span> </div>`
            }
            $('.pm__win-rewards').html(html);
        }

    },

    confirmExchangeItem() {
        let me = this;
        $(document).on('click', '.pm__item .pm__btn-confirm-exchange', function (e) {
            e.preventDefault();
            let btnClaim = $(this).siblings('.pm__btn-claim[data-value]:not(.off):not(.received)');
            me.popupConfirmExchange.find('.btn-default').removeAttr('data-value').removeAttr('onClick');
            if (btnClaim.length > 0) {
                me.popupConfirmExchange.addClass('active');
                me.popupConfirmExchange.find('.pm__inform-text').html(btnClaim.attr('data-text-confirm'));
                me.popupConfirmExchange.find('.pm__exchange').attr('data-value', btnClaim.attr('data-value')).attr('onclick', 'LuckyDrawExchangeModuleV3.exchangeItem(this)')
            }
        })
    },

    switchPool(isResetCoefficient = 0, el = null) {
        let _this = $(el);
        console.log(_this)
        let me = this;
        if (me.exec_start === false) {
            me.exec_start = true;
            $.ajax({
                type: "POST",
                url: mainProgramUrl + '/switch-pool',
                dataType: "json",
                data: {
                    isResetCoefficient: isResetCoefficient,
                    poolID: _this.attr('data-value')
                },
                success: function (response) {
                    if (response.status === 0) {
                        $('.pm__inform').addClass('active');
                        $('.pm__inform-text').html(response.data);
                        $('#popup_reset').removeClass('active');
                    }
                    if (response.status === 1) {
                        me.exec_start = false;
                        $('.pm__inform').addClass('active');
                        $('.pm__inform-text').html(response.data);
                        $('#popup_reset').removeClass('active');
                        me.fetchViewData();
                    } else if (response.status === -2) {
                        me.exec_start = false;
                        $('#popup_warning .btn-got').attr('onClick', 'LuckyDrawExchangeModuleV3.switchPool(1)');
                        $("#popup_warning").addClass('active');
                        $('#popup_reset').removeClass('active');
                        //show popup
                        me.fetchViewData();
                    } else {
                        me.exec_start = false;
                        $('.pm__inform').addClass('active');
                        $('.pm__inform-text').html(response.data);
                        $('#popup_reset').removeClass('active');
                    }
                },
                error: function (response) {
                    inform(response);
                }
            });
        }
    },

    refreshPointIngame() {
        let me = this;
        if (me.exec_start === false) {
            me.exec_start = true;
            $.ajax({
                type: "POST",
                url: mainProgramUrl + '/refresh-point-ingame',
                success: function (response) {
                    if (response.status === 1) {
                        me.exec_start = false;
                        // $('.pm__inform').addClass('active');
                        // $('.pm__inform-text').html(response.data);
                        // $('#popup_reset').removeClass('active');
                        me.fetchViewData();
                    } else {
                        me.exec_start = false;
                        $('.pm__inform').addClass('active');
                        $('.pm__inform-text').html(response.data);
                        // $('#popup_reset').removeClass('active');
                    }
                },
                error: function (response) {
                    inform(response);
                }
            });
        }
    }
};

$(document).ready(function () {
    LuckyDrawExchangeModuleV3.init();
});

