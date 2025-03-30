// Core Button event
/**
 * pm__show-condition-list (add to button's class to show condition list popup)
 *
 */

// Core Popup class
/**
 * pm__condition-list (add to popup show list condition)
 *
 */

//Table Data Class
/**
 * pm__list-table-data (add to div and will append new table inside a div)
 *
 */

//global variable
/**
 * menu
 * langs
 */

class CoreLuckydrawExchangeV2 {

    #arrConditions = [
        'CONDITION_DATE',
        'CONDITION_PROFILE',
        'CONDITION_FACEBOOK',
        'CONDITION_ROLE',
        'CONDITION_INVITE',
        'CONDITION_INVITE_CODE',
        'GET_EACH_CHARGE_FIXED_CASH',
        'GET_EACH_CHARGE_RANGE_CASH',
        'GET_TOTAL_FIXED_CASH',
        'GET_TOTAL_RANGE_CASH',
        'CONDITION_QUIZ',
        'CONDITION_ALL',
        'CONDITION_AFTER_TIME_INTERVAL',
        'CONDITION_GAME_CURRENCY'
    ];

    formTitleSelector = 'pm__title-form';
    selectRoleBtnSelector = 'pm__menu-selectrole';

    constructor() {
        this.initModuleBtnEvent();
        this.initConditionListOption();
        this.initEnterCodeForm();
    }

    initEnterCodeForm(){
        if(typeof isConditionInviteModule != 'undefined'){
            if(isConditionInviteModule == '1'){
                if(location.href.search('/?submit') > -1){
                    $(`.${this.formTitleSelector}`).html(dict('CONDITION_CODE_DESCRIPTION_SUBMIT'));
                    $(`.${this.formTitleSelector}`).css("margin","20px");
                    $(`.${this.formTitleSelector}`).css("font-size","24px");
                    $(`.${this.formTitleSelector}`).removeClass(this.formTitleSelector);
                }
            }
        }
    }

    initModuleBtnEvent() {
        $(".pm__show-condition-list").click(function () {
            $(".pm__condition-list").addClass("active");
        });

        if(isLogin == 0){
            $(".pm__menu-exchange-history").click(function (){
                window.location.reload();
            });
        }
    }

    getTitleCondition(sKeyCondition) {
        return dict(sKeyCondition + '_TITLE');
    }

    showSelectRoleBtn(){
        $(`.${this.selectRoleBtnSelector}`).css("display","inline-block");
    }

    initConditionListOption() {

        let sConditionList = ``;
        let iIndex = 1;

        for (var propertyName in menu) {

            if (this.#arrConditions.includes(propertyName)) {

                let sTitle = this.getTitleCondition(propertyName);
                let sUrl = menu[propertyName].uri;

                sConditionList += `
                    <tr>
                        <td>${iIndex}</td>
                        <td>${sTitle}</td>
                        <td><a href="${sUrl}" class="btn btn-empty-blue hover-light btn-take-action pm__anchor">${dict('CONDITION_TABLE_BUTTON_RECEIVE_TITLE')}</a></td>
                    </tr>`;
                iIndex++;
            }else{
                //for extend condition
                if(propertyName.search("CONDITION_") > -1){
                    let sTitle = menu[propertyName].title;
                    let sUrl = menu[propertyName].uri;

                    sConditionList += `
                    <tr>
                        <td>${iIndex}</td>
                        <td>${sTitle}</td>
                        <td><a href="${sUrl}" class="btn btn-empty-blue hover-light btn-take-action pm__anchor">${dict('CONDITION_TABLE_BUTTON_RECEIVE_TITLE')}</a></td>
                    </tr>`;
                    iIndex++;
                }else{
                    if(propertyName.search("SELECT_ROLE") > -1){
                        this.showSelectRoleBtn();
                    }
                }

            }

        }

        $('.pm__list-table-data').append(
            `<table>
                <thead>
                    <tr>
                        <th>${dict('CONDITION_TABLE_HEADER_ORDER')}</th>
                        <th>${dict('CONDITION_TABLE_HEADER_CONDITION_TITLE')}</th>
                        <th>${dict('CONDITION_TABLE_HEADER_ACTION')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${sConditionList}
                </tbody>
            </table>`);
    }
}

$(document).ready(function(){
    new CoreLuckydrawExchangeV2();
});
