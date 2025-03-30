var feedToWall = function () {
};

class ConditionType {

    uri = ""
    curPage = 1
    resConditionConfig = {}

    gloVar = {
        langs: langs,
        oMenu: menu,
        luckyDrawGiftExchangeModule: LuckyDrawExchangeModule,
        rowPerPage: 10
    }

    conditionSelector = {
        conditionForm: "#pm__condition-form",
        shareForm: "#pm__share-form",
        quizForm: "#pm__quiz-form",
        inviteForm: "#pm__invite-form"
    }

    conditions = {
        TYPE_BY_QUIZ: 'BY_QUIZ',
        TYPE_BY_SHARE_FB: 'BY_SHARE_FB',
        TYPE_BY_DATE: 'BY_DATE',
        TYPE_BY_INVITE: 'BY_INVITE',
        TYPE_BY_PROFILE: 'BY_PROFILE',
        TYPE_BY_PRE_REGIS_STORE: 'BY_PRE_REGIS_STORE',
        TYPE_BY_GIFT_PACKAGE: 'BY_GIFT_PACKAGE',
        TYPE_CONDITION_MODULE_BY_GIFT_PACKAGE_COLLECTION: 'CONDITION_MODULE_BY_GIFT_PACKAGE_COLLECTION',
        TYPE_BY_GAME_CURRENCY: 'BY_GAME_CURRENCY',
        TYPE_AFTER_TIME_INTERVAL: 'AFTER_TIME_INTERVAL',
        TYPE_BY_ROLE: 'BY_ROLE',
        TYPE_BY_PAY_FIXED_CASH: 'BY_PAY_FIXED_CASH',
        TYPE_BY_FIXED_CASH: 'BY_FIXED_CASH',
        TYPE_BY_TOTAL_FIXED_CASH: 'BY_TOTAL_FIXED_CASH',
        TYPE_BY_RANGE_CASH: 'BY_RANGE_CASH',
        TYPE_BY_TOTAL_RANGE_CASH: 'BY_TOTAL_RANGE_CASH',
        TYPE_BY_ADVANCE: 'BY_ADVANCE',
        TYPE_BY_LIST_USER: 'BY_LIST_USER',
        TYPE_CONDITION_ALL: 'CONDITION_ALL',
        TYPE_BY_LINK: 'BY_LINK'
    }

    groupTypes = {
        GROUP_TYPE_CONDITION_FACEBOOK: 'CONDITION_FACEBOOK',
        GROUP_TYPE_CONDITION_ROLE: 'CONDITION_ROLE',
        GROUP_TYPE_CONDITION_QUIZ: 'CONDITION_QUIZ',
        GROUP_TYPE_CONDITION_INVITE: 'CONDITION_INVITE',
        GROUP_TYPE_GET_PAY_FIXED_CASH: 'GET_PAY_FIXED_CASH',
        GROUP_TYPE_GET_TOTAL_FIXED_CASH: 'GET_TOTAL_FIXED_CASH',
        GROUP_TYPE_GET_TOTAL_RANGE_CASH: 'GET_TOTAL_RANGE_CASH',
        GROUP_TYPE_GET_EACH_CHARGE_FIXED_CASH: 'GET_EACH_CHARGE_FIXED_CASH',
        GROUP_TYPE_GET_EACH_CHARGE_RANGE_CASH: 'GET_EACH_CHARGE_RANGE_CASH',
        GROUP_TYPE_CONDITION_ALL: 'CONDITION_ALL',
        GROUP_TYPE_CONDITION_LINK: 'CONDITION_LINK'
    }

    constructor(resConditionConfig = {}, uri = '', curPage) {
        this.uri = uri;
        this.curPage = curPage;
        this.resConditionConfig = resConditionConfig;
    }

    handleUI() {
        let condition = this.conditions;
        let resConditionConfig = this.resConditionConfig;
        switch (resConditionConfig.conditionType) {
            case condition.TYPE_BY_SHARE_FB:
                this.handleConditionShare();
                break;
            case condition.TYPE_BY_INVITE:
                this.handleConditionInvite();
                break;
            case condition.TYPE_BY_QUIZ:
                this.handleConditionQuiz();
                break;
            default:
                this.handleDefaultCondition();
                break;
        }
        this.toggleCondition();
        this.handleHistory();
        this.handleCaptcha("");
    }

    handleDefaultCondition() {
        let conditionConfig = this.resConditionConfig;
        let formSelector = this.conditionSelector;
        let isReceive = conditionConfig.isReceive ? 1 : 0;
        let conditionType = conditionConfig.conditionType;
        let conditionModule = $('.pm__condition-module');
        conditionModule.find(':submit').removeAttr('onclick');
        let that = this;

        if (typeof beforeHandleDefaultCondition == "function") {
            beforeHandleDefaultCondition(this);
        }

        switch (conditionType) {
            case this.conditions.TYPE_BY_PRE_REGIS_STORE:
                break;
            default:
                conditionModule.find('.pm__title-form').html(conditionConfig.programModuleExternalName);
                if (typeof customTitleForm != 'undefined') {
                    conditionModule.find('.pm__title-form').html(customTitleForm);
                }
                if (isReceive) {
                    conditionModule.find(':submit').attr('onclick', `alert("${dict('CONDITION_ALREADY_RECEIVED')}");return false`);
                } else {
                    conditionModule.find(':submit').attr('value', dict('TEXT_GET_POINT'));
                    $(formSelector.conditionForm).off();
                    $(formSelector.conditionForm).on("submit", function (e) {
                        e.preventDefault();
                        that.handleSubmitAction(conditionConfig);
                    });
                }
                break;
        }

    }

    handleConditionQuiz() {
        let me = this;
        let conditionConfig = me.resConditionConfig;
        let quizzes = conditionConfig.quizzes;
        let answers = conditionConfig.answers;
        let isReceive = conditionConfig.isReceive ? 1 : 0;
        let formSelector = me.conditionSelector;

        let ConditionQuiz = {
            init() {
                this.toggleCondition();
                this.initConditionStatus();
            },
            initConditionStatus() {
                let conditionModule = $('.pm__condition-module');
                // answered
                if (isReceive) {
                    conditionModule.find('.captcha').remove();
                    conditionModule.find('input[name="captcha"]').remove();
                    conditionModule.find(':submit').attr('onclick', `alert("${dict('CONDITION_ALREADY_RECEIVED')}");return false`);
                } else {
                    // answer directly
                    // conditionModule.find('.captcha').remove();
                    // conditionModule.find('input[name="captcha"]').remove();
                    $(formSelector.quizForm).on("submit", function (e) {
                        e.preventDefault();
                        me.handleSubmitAction(conditionConfig);
                    });
                    // conditionModule.find(':submit').attr('value', dict('TEXT_GET_POINT'));
                }

                let quizContainer = $('.pm__quiz-container');
                let tempQuiz = quizContainer.find('.pm__quiz').first();
                if (tempQuiz.length === 0) {
                    tempQuiz = $(`<div class="pm__quiz">
                            <div class="pm__quiz-name"></div>
                            <div class="pm__quiz-answer-list">
                                <div class="pm__quiz-answer">
                                    <input type="radio" id="" name="" value="" class="pm__quiz-answer-value">
                                    <label for="" class="pm__quiz-answer-text"></label>
                                </div>
                            </div>
                        </div>`)
                }
                // empty container
                quizContainer.html('');

                $.each(quizzes, function (pmid, item) {
                    let quiz = tempQuiz.clone();
                    let indexAnswered = answers[pmid]?.Note || -1;

                    let listAnswer = JSON.parse(item.ConditionModuleConfig.Note);
                    let tempAnswer = quiz.find('.pm__quiz-answer').first();
                    let quizAnswerList = quiz.find('.pm__quiz-answer-list');

                    // empty the answers
                    quizAnswerList.html('');

                    $.each(listAnswer, function (index, text) {
                        let answer = tempAnswer.clone();

                        answer.find('.pm__quiz-answer-text').html(text).attr('for', `#Answer_${pmid}_${index}`);
                        let answerValue = answer.find('.pm__quiz-answer-value');
                        answerValue.attr('id', `#Answer_${pmid}_${index}`).attr('name', `Answer[${pmid}]`).val(index);
                        if (index === 0) {
                            answerValue.attr('required', 'required');
                        }
                        if (indexAnswered == index) {
                            answerValue.attr('checked', true)
                        }

                        quizAnswerList.append(answer);
                    });

                    if (indexAnswered !== -1) {
                        quiz.addClass('answered');
                        quiz.find('.pm__quiz-answer-value').attr('disabled', 'disabled');
                    }

                    quiz.find('.pm__quiz-name').html(item.ProgramModule.ProgramModuleName);
                    quizContainer.append(quiz);
                })
            }
            ,
            toggleCondition() {

            }
        };

        $(function () {
            ConditionQuiz.init()
        });
    }

    handleConditionQuestion() {
        let conditionConfig = this.resConditionConfig;
    }

    //suitable for invite by link
    handleConditionInvite() {
        let that = this;
        let conditionConfig = this.resConditionConfig;
        let isCheckInviterByApi = 0;
        let oldInviter = 0;
        let conditionNote = conditionConfig["condition_note"];
        let isInviteCode = typeof conditionNote['Code'] != "undefined" ? 1 : 0;
        let isInviteLink = typeof conditionNote['Link'] != "undefined" ? 1 : 0;
        let urlInvite = conditionConfig.urlInvite;

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        let isSubmit = conditionConfig.isSubmit;
        let isReceived = conditionConfig.isReceive;


        let conditionModule = $('.pm__condition-module');
        conditionModule.find(':submit').removeAttr('onclick');
        if (isSubmit) {
            if (isInviteCode) {
                if (isCheckInviterByApi == 1 && oldInviter == 0) {
                    conditionModule.find("#text-invite").attr("value", $("#text-invite").val() + urlInvite);
                }
                conditionModule.find('.pm__invite-des').html(dict('CONDITION_CODE_DESCRIPTION_SUBMIT'));
                conditionModule.find('.pm__invite-text').remove();
                conditionModule.find('.pm__invite-copy').remove();
                conditionModule.find('input[name="code"]').css("display", "block");
                conditionModule.find("#text-invite").css("display", "none");

                conditionModule.find(".pm__copy-link").css("display", "none");
                conditionModule.find("#pm__invite-form *[type='submit']").css("display", "block");

                // if (isReceived) {
                //     conditionModule.find('.captcha').remove();
                //     conditionModule.find('input[name="captcha"]').remove();
                //     conditionModule.find(':submit').attr('onclick', `alert("${dict('CONDITION_ALREADY_RECEIVED')}");return false`);
                // } else if (conditionConfig.captchaCount) {
                //     conditionModule.find('.captcha img').attr('src', '<?= $captcha->generateImage( $captchaCode ) ?>');
                //     conditionModule.find(':submit').attr('value', dict('TEXT_GET_POINT'));
                // } else {
                //     conditionModule.find('.captcha').remove();
                //     conditionModule.find('input[name="captcha"]').remove();
                //     conditionModule.find(':submit').attr('value', dict('TEXT_GET_POINT'));
                // }

                $("#pm__invite-form").off();
                $("#pm__invite-form").on("submit", function (e) {
                    e.preventDefault();
                    that.handleSubmitAction(conditionConfig);
                });

            } else if (isInviteLink) {
                conditionModule.find('.pm__invite-des').html("Hình thức mời bằng link không cần nhập mã code.");
                conditionModule.find('.pm__invite-text').remove();
                conditionModule.find('.pm__invite-copy').remove();
                conditionModule.find('.pm__invite-code').remove();
                conditionModule.find('.captcha').remove();
                conditionModule.find('input[name="captcha"]').remove();
                conditionModule.find(':submit').remove();
            }
        } else {
            //Show invite link/code
            // conditionModule.find('.captcha').remove();
            // conditionModule.find('input[name="captcha"]').remove();
            conditionModule.find('input[name="code"]').css("display", "none");
            // conditionModule.find('.btn-submit').remove();
            conditionModule.find("#text-invite").css("display", "block");
            conditionModule.find(".pm__copy-link").css("display", "block");
            conditionModule.find("#pm__invite-form *[type='submit']").css("display", "none");

            if (isInviteCode) {
                conditionModule.find('.pm__invite-des').html(dict('CONDITION_CODE_DESCRIPTION'));
                conditionModule.find("#text-invite").attr("value", urlInvite);
            } else if (isInviteLink) {
                conditionModule.find("#text-invite").attr("value", "");
                conditionModule.find('.pm__invite-des').html(dict('CONDITION_LINK_DESCRIPTION'));
                conditionModule.find("#text-invite").attr("value", conditionNote['Link'] + urlInvite);
            }
        }
    }

    handleConditionShare() {
        let conditionConfig = this.resConditionConfig;
        if (conditionConfig.isReceive == 1) {
            feedToWall = function () {
                alertError(dict('CONDITION_ERROR_CODE_SHARE_FACEBOOK_REACHED_LIMIT'));
                return 1;
            }
        }

        let conditionNote = conditionConfig["condition_note"];
        let linkShare = conditionConfig.linkShare;
        let fb_hashtag = "<?= $condition_note['Hashtag'] ?>";
        let fb_link = conditionNote["Link"] + conditionConfig.urlInvite;
        let fb_appId = conditionNote['AppID'];
        let fb_quote = conditionNote['Quote'];
        window.fbAsyncInit = function () {
            FB.init({ appId: fb_appId, xfbml: true, version: 'v2.10' });
        };
        feedToWall = function () {
            if (typeof fbLinkCustom != 'undefined') {
                fb_link = fbLinkCustom;
            }
            FB.ui({ method: 'share', hashtag: fb_hashtag, href: fb_link, quote: fb_quote, mobile_iframe: true, display: 'popup' }, function (response) {
                // by pass
                if (true || response) {
                    $.ajax({
                        type: "GET",
                        url: linkShare,
                        success: function (response) {
                            if (response.data != undefined) {
                                alert(response.data.msg);
                            }
                            that.handleFetchViewData();
                            startFetchCondition(that.uri);
                            that.handleCaptcha();
                        },
                        error: function (response) {
                        },
                        beforeSend: function () {
                        }
                    });
                } else {
                    // sometime can not receive response from fb
                    // might by-pass this
                    alert(`<p class="flash flash-fail">${dict('CONDITION_ERROR_CODE_SHARE_FACEBOOK_NOT_SHARE')}</p>`);
                    return false;
                }
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }

    toggleCondition() {
        let conditionConfig = this.resConditionConfig;
        let conditionType = conditionConfig.conditionType;
        let conditions = this.conditions;
        let formSelectors = this.conditionSelector;
        let showForm = '';

        switch (conditionType) {
            case conditions.TYPE_BY_INVITE:
                showForm = formSelectors.inviteForm;
                break;
            case conditions.TYPE_BY_SHARE_FB:
                showForm = formSelectors.shareForm;
                break;
            case conditions.TYPE_BY_QUIZ:
                showForm = formSelectors.quizForm;
                break;
            default:
                showForm = formSelectors.conditionForm;
                break;
        }

        $(`.pm__condition-module ${formSelectors.conditionForm}`).css("display", "none");
        $(`.pm__condition-module ${formSelectors.quizForm}`).css("display", "none");
        $(`.pm__condition-module ${formSelectors.inviteForm}`).css("display", "none");
        $(`.pm__condition-module ${formSelectors.shareForm}`).css("display", "none");

        $(`.pm__condition-module ${showForm}`).css("display", "block");

        $('.pm__condition-module .pm__title-form').html(conditionConfig.programModuleExternalName);
    }

    renderTableHistory(head, body) {
        return (`
                <table>
                    <thead>
                        ${head}
                    </thead>
                    <tbody>
                        ${body}
                    </tbody>
                </table>
            `

        )
    }

    handleHistory() {

        this.handlePaginateHistory();

        let resCondition = this.resConditionConfig;
        let groupsTypes = this.groupTypes;
        let tplTableHistoryHead = ``;
        let tplTableHistoryBody = ``;
        let historyData = resCondition.history;
        let rowPerPage = this.gloVar.rowPerPage;

        if (typeof resCondition.history == "undefined") {
            return 1;
        }

        if ([groupsTypes.GROUP_TYPE_CONDITION_ALL, groupsTypes.GROUP_TYPE_CONDITION_ROLE].includes(resCondition.GroupType)) {
            tplTableHistoryHead += `
                     <tr>
                         <th>${dict('TEXT_NUMERIC_ORDER')}</th>
                         <th>${dict('CONDITION')}</th>
                         <th>${dict('CONDITION_NUMBER_OF_POINT')}</th>
                         <th>${dict('TEXT_TIME')}</th>
                     </tr>`;

            for (let i = 0; i < historyData.data.length; i++) {
                let rowData = historyData.data[i];
                tplTableHistoryBody += `
                    <tr>
                         <td>${(parseInt(rowPerPage) * (parseInt(historyData.currentPage) - 1)) + i + 1}</td>
                         <td>${resCondition.listPMName[rowData.PModuleID]}</td>
                         <td>${rowData.Point}</td>
                         <td>${rowData.CreatedAt}</td>
                     </tr>
                    `;
            }

        } else {
            if (resCondition.GroupType == groupsTypes.GROUP_TYPE_CONDITION_INVITE) {
                tplTableHistoryHead += `
                     <tr>
                         <th>${dict('TEXT_NUMERIC_ORDER')}</th>
                         <th>${dict('CONDITION_NUMBER_OF_POINT')}</th>
                         <th>${dict('CONDITION_FRIEND')}</th>
                         <th>${dict('TEXT_TIME')}</th>
                     </tr>`;

                for (let i = 0; i < historyData.data.length; i++) {
                    let rowData = historyData.data[i];
                    let friendName = "";

                    if (rowData.aNote) {
                        if (rowData.aNote['CharacterName']) {
                            friendName = rowData.aNote['CharacterName'];
                        }
                        if (rowData.aNote['AccountName']) {
                            friendName = rowData.aNote['AccountName'];
                        }
                    }

                    tplTableHistoryBody += `
                    <tr>
                         <td>${(parseInt(rowPerPage) * (parseInt(historyData.currentPage) - 1)) + i + 1}</td>
                         <td>${rowData.Point}</td>
                         <td>${friendName}</td>
                         <td>${rowData.CreatedAt}</td>
                     </tr>
                    `;
                }
            } else {

                tplTableHistoryHead += `
                         <tr>
                             <th>${dict('TEXT_NUMERIC_ORDER')}</th>
                             <th>${dict('CONDITION_NUMBER_OF_POINT')}</th>
                             <th>${dict('TEXT_TIME')}</th>
                         </tr>`;

                for (let i = 0; i < historyData.data.length; i++) {
                    let rowData = historyData.data[i];
                    tplTableHistoryBody += `
                            <tr>
                                 <td>${(parseInt(rowPerPage) * (parseInt(historyData.currentPage) - 1)) + i + 1}</td>
                                 <td>${rowData.Point}</td>
                                 <td>${rowData.CreatedAt}</td>
                             </tr>`;
                }

                if (resCondition.programSlug == 'playtogether/tet2025') {
                    tplTableHistoryHead = ``;
                    tplTableHistoryBody = ``;
                    tplTableHistoryHead = `
                    <tr>
                        <th>${dict('TEXT_NUMERIC_ORDER')}</th>
                        <th>Tên</th>
                        <th>${dict('CONDITION_NUMBER_OF_POINT')}</th>
                        <th>${dict('TEXT_TIME')}</th>
                    </tr>`;

                    for (let i = 0; i < historyData.data.length; i++) {
                        let rowData = historyData.data[i];
                        tplTableHistoryBody += `
                       <tr>
                            <td>${(parseInt(rowPerPage) * (parseInt(historyData.currentPage) - 1)) + i + 1}</td>
                            <td>${(resCondition.listPMName[rowData.PModuleID])}</td>
                            <td>${rowData.Point}</td>
                            <td>${rowData.CreatedAt}</td>
                        </tr>`;
                    }
                }

            }

        }


        $('.pm__condition-module .pm__form-history').html(this.renderTableHistory(tplTableHistoryHead, tplTableHistoryBody) + this.handlePaginateHistory());


        //     <?php $pagination->paginate() ?>
    }


    handlePaginateHistory() {
        let hisData = this.resConditionConfig.history;
        if (typeof hisData == "undefined") {
            return "";
        }

        // console.log(resCondition);
        let totalPage = parseInt(hisData.totalPage);

        if (totalPage <= 1) {
            return "";
        }

        let url = this.uri;

        let html = `<nav aria-label="Page navigation example"><ul class="pm__pagination pagination">`;

        if (this.curPage > 1) {
            html += `<li class="page-item">
                        <a class="page-back button-back" href="javascript:void(0)" onclick="startFetchCondition('${url}',${this.curPage})" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Prev</span>
                </a>
                </li>`;
        }

        let startPage = this.curPage - 3;
        let endPage = this.curPage + 2;

        for (let i = this.curPage - 1; i >= startPage && i >= 1; i--) {
            html += `<li class="page-item "><a class="page-link" onclick="startFetchCondition('${url}',${this.curPage - i})" href="javascript:void(0)">${this.curPage - i}</a></li>`;
        }

        html += `<li class="page-item active"><a class="page-link" onclick="startFetchCondition('${url}',${this.curPage})" href="javascript:void(0)">${this.curPage}</a></li>`;

        for (let i = this.curPage + 1; i <= endPage && i <= totalPage; i++) {
            html += `<li class="page-item "><a class="page-link" onclick="startFetchCondition('${url}',${i})"  href="javascript:void(0)">${i}</a></li>`;
        }


        if (this.curPage < totalPage) {
            html += `<li class="page-item">
                        <a class="page-next button-next" onclick="startFetchCondition('${url}',${this.curPage + 1})"  href="javascript:void(0)" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>`;
        }


        html += '</ul></nav>';

        return html;
    }

    handleFetchViewData() {
        this.gloVar.luckyDrawGiftExchangeModule.fetchViewData();
        if (typeof afterFetchViewDataCondition == "function") {
            afterFetchViewDataCondition();
        }
    }

    handleCaptcha(captchaIMG = "") {
        let conditionModule = $('.pm__condition-module');

        if (captchaIMG == "") {
            conditionModule.find('.captcha #refresh-captcha').css('display', "none");
            conditionModule.find('.captcha img').css('display', "none");
            conditionModule.find('input[name="captcha"]').css("display", "none");
            conditionModule.find('input[name="captcha"]').val("");
        } else {
            conditionModule.find('.captcha').css("display", "block");
            conditionModule.find('.captcha img').attr('src', captchaIMG);
            conditionModule.find('input[name="captcha"]').css("display", "block");
            conditionModule.find('.captcha #refresh-captcha').css('display', "block");
            conditionModule.find('.captcha #refresh-captcha').css('cursor', "pointer");
            conditionModule.find('.captcha img').css('display', "block");
        }

    }

    handleSubmitAction() {

        let resConditionConfig = this.resConditionConfig;
        let that = this;
        let conditionModule = $('.pm__condition-module');
        let captchaVal = conditionModule.find('input[name="captcha"]').val();
        let data = { captcha: captchaVal };

        let amountVal = conditionModule.find('input[name="amount"]').val();
        if (typeof amountVal != "undefined" && amountVal != "") {
            data["amount"] = amountVal;
        }

        if (resConditionConfig.conditionType == this.conditions.TYPE_BY_QUIZ) {
            var formDataArray = conditionModule.find(this.conditionSelector.quizForm).serializeArray();
            var formDataObject = {};
            $.each(formDataArray, function (index, field) {
                formDataObject[field.name] = field.value;
            });
            data = Object.assign(data, formDataObject);
        }

        if (resConditionConfig.conditionType == this.conditions.TYPE_BY_INVITE) {
            captchaVal = conditionModule.find('#pm__invite-form input[name="captcha"]').val();
            let inviteCode = conditionModule.find('#pm__invite-form input[name="code"]').val();
            data["captcha"] = captchaVal;
            data["code"] = inviteCode;
        }

        if (typeof beforeConditionSubmit == "function") {
            data = beforeConditionSubmit(data);
        }

        $.ajax({
            type: "POST",
            url: that.uri,
            data: data,

            success: function (response) {

                if (typeof afterConditionSubmit == "function") {
                    response = afterConditionSubmit(response);
                }

                switch (response.status) {
                    case 1:

                        let msgResponse = '';
                        for (let pmid in response.data) {
                            msgResponse += response.data[pmid].msg + "<br>";
                        }
                        alert(msgResponse);
                        that.handleFetchViewData();
                        // that.handleHistory();
                        startFetchCondition(that.uri);
                        that.handleCaptcha();
                        break;
                    case -1:
                        alert(response.data.msg);
                        that.handleCaptcha(response.data["captcha-img"]);
                        break;
                    case "auto_redirect_link":
                        location.reload();
                        break;
                }

            },
            error: function (response) {
            },
            beforeSend: function () {
            }
        });
    }

}

class AjaxCondition {

    globalVar = {
        menu: menu
    }

    constructor() {
        this.initCaptcha();
    }

    initCaptcha() {
        let conditionModule = $('.pm__condition-module');
        conditionModule.find('.captcha').css("display", "none");
        conditionModule.find('input[name="captcha"]').css("display", "none");
    }


    initMenu() {
        let oMenu = JSON.parse(this.globalVar.menu);
        let that = this;



        for (let i in oMenu) {
            let uri = oMenu[i].uri;
            switch (i) {
                case 'PROFILE':
                    $('.pm__menu-profile a, a.pm__menu-profile').attr('href', uri);
                    $('.pm__menu-profile-update a, a.pm__menu-profile-update').attr('href', uri + '?update');
                    break;
                case 'CONDITION_DATE':
                    $('.pm__menu-date a, a.pm__menu-date').attr('href', uri);
                    $('.pm__menu-date a, a.pm__menu-date').on("click", function (e) {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-date a, a.pm__menu-date').attr("href", "javascript:void(0)");
                    break;
                case 'CONDITION_AFTER_TIME_INTERVAL':
                    $('.pm__menu-afterinterval a, a.pm__menu-afterinterval').attr('href', uri);
                    break;
                case 'CONDITION_QUIZ':
                    $('.pm__menu-quiz a, a.pm__menu-quiz').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-quiz a, a.pm__menu-quiz').attr("href", "javascript:void(0)");
                    break;
                case 'CONDITION_FACEBOOK':
                    $('.pm__menu-share a, a.pm__menu-share').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-share a, a.pm__menu-share').attr("href", "javascript:void(0)");
                    break;
                case 'CONDITION_ROLE':
                    $('.pm__menu-level a, a.pm__menu-level').attr('href', uri);
                    break;
                case 'CONDITION_INVITE':
                    $('.pm__menu-invite a, a.pm__menu-invite').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-invite a, a.pm__menu-invite').attr("href", "javascript:void(0)");
                    break;
                case 'CONDITION_INVITE_CODE':
                    $('.pm__menu-invitecode a, a.pm__menu-invitecode').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-invitecode a, a.pm__menu-invitecode').attr("href", "javascript:void(0)");
                    break;
                case 'GET_EACH_CHARGE_FIXED_CASH':
                case 'GET_EACH_CHARGE_RANGE_CASH':
                    $('.pm__menu-cash a, a.pm__menu-cash').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-cash a, a.pm__menu-cash').attr("href", "javascript:void(0)");
                    break;
                case 'GET_TOTAL_FIXED_CASH':
                case 'GET_TOTAL_RANGE_CASH':
                    $('.pm__menu-totalcash a, a.pm__menu-totalcash').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $('.pm__menu-totalcash a, a.pm__menu-totalcash').attr("href", "javascript:void(0)");
                    break;
                case 'GET_EXCHANGE_POINT':
                    $('.pm__menu-exchangepoint a, a.pm__menu-exchangepoint').attr('href', uri);
                    break;
                case 'HISTORY':
                    $('.pm__menu-history a, a.pm__menu-history').attr('href', uri);
                    $('.pm__menu-history-all a, a.pm__menu-history-all').attr('href', uri + '?all');
                    break;
                case 'RANK':
                    $('.pm__menu-rank a, a.pm__menu-rank').attr('href', uri);
                    break;
                case 'RANK_SERVER':
                    $('.pm__menu-rankserver a, a.pm__menu-rankserver').attr('href', uri);
                    break;
                case 'CONDITION_ALL':
                    $('.pm__menu-allcondition a, .pm__menu-condition a, a.pm__menu-allcondition, a.pm__menu-condition').on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $(".pm__menu-allcondition-history a, a.pm__menu-allcondition-history").on("click", function () {
                        that.fetchConditionDetail(uri);
                    });
                    $(".pm__menu-allcondition-history a, a.pm__menu-allcondition-history").attr("href", "javascript:void(0)");
                    $('.pm__menu-allcondition a, .pm__menu-condition a, a.pm__menu-allcondition, a.pm__menu-condition').attr("href", "javascript:void(0)");
                    break;
                case 'SELECT_ROLE':
                    $('.pm__menu-selectrole a, a.pm__menu-selectrole').attr('href', uri);
                    break;
                case 'GIFT_RETRY':
                    $('.pm__menu-giftretry a, a.pm__menu-giftretry').attr('href', uri);
                    break;
                default:
                    let menuEle = $(`.pm__menu-${i}`);
                    if (menuEle.length > 0) {
                        menuEle.on("click", function () {
                            that.fetchConditionDetail(uri);
                        });
                        menuEle.attr("href", "javascript:void(0)");
                    }
            }
        }

        //custom link condition
        $(".pm__menu-ajax-custom").on("click", function (e) {
            let ele = $(e.target);
            let attrHref = ele.attr("tmp-href");
            that.fetchConditionDetail(attrHref);
        });


        var refresh = $('#refresh-captcha');
        var captchaImage = $("#captcha-image");
        refresh.click(function () {
            $.get(baseURL + "/ajax/reloadcaptcha", function (data) {
                if (typeof data.success != 'undefined') {
                    captchaImage.attr('src', data.data);
                }
            });
        })

    }

    fetchConditionDetail(uri, page = 1) {
        let that = this;
        let url = uri;
        if (page > 1) {
            url = uri + "?page=" + page;
        }
        $.ajax({
            type: "GET",
            url: url,
            success: function (response) {
                that.handleUiCondition(response.data, uri, page);
                $(".pm__condition-module").addClass("active");
            },
            error: function (response) {
            },
            beforeSend: function () {
            }
        });
    }


    handleUiCondition(conditionData, uri, page) {
        let conditionType = new ConditionType(conditionData, uri, page);
        conditionType.handleUI();
    }


}

let ajaxCondition = new AjaxCondition();

function startFetchCondition(uri, page = 1) {
    ajaxCondition.fetchConditionDetail(uri, page);
}

$(document).ready(function () {
    // put usingAjax = true in head tag
    if (typeof usingAjax != "undefined") {
        setTimeout(function () {
            ajaxCondition.initMenu();
        }, 1000);
    }
});