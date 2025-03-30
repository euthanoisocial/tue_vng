let HistoryAjax = {
    exec_start: false,
    selector: {
        popupHistory: '.pm__history-module',
        btnHistory: '.pm__btn-history',
        pagination: '.pm__pagination',
        pageLink: '.page-link'
        
    },
    row_per_page: 10,
    GIFT_MODULE_GIFT_PACKAGE_OUT_GAME: 2,
    init() {
        const rowPerPage = $(this.selector.btnHistory).attr('data-row-per-page');
        this.row_per_page = rowPerPage ? parseInt(rowPerPage, 10) : this.row_per_page;
        this.getHistory();
    },

    /**
     * Initializes the history fetching process by binding a click event to the history button.
     * When the button is clicked, it fetches the history based on the button's data-type and data-template attributes.
     * 
     * @param {number} page - The page number to fetch history for. Defaults to 1.
     * @param {string|null} type - The type of history to fetch. Defaults to null.
     * @param {string} templateType - The template type to use for rendering history. Defaults to 'default'.
     */
    getHistory(page = 1, type = null, templateType = 'default') {
        let me = this;
        $(me.selector.btnHistory).on('click', function(e) {
            e.preventDefault();
            if(isLogin !==1) {
                return;
            }
            const type = $(this).attr('data-type');
            const templateType = $(this).attr('data-template') ?? 'default';
            me.fetchHistory(page, type, templateType);
        });
    },
    
    /**
     * Fetches history data based on the provided parameters and renders it using the specified template type.
     * 
     * This function initiates an AJAX GET request to fetch history data. It sets a flag to prevent concurrent executions.
     * The request includes the current page number, type of history, and the number of rows per page. The response is then
     * processed based on its status. If successful, it renders the history using the specified template type. If not successful,
     * it informs the user of the error.
     * 
     * @param {number} page - The page number to fetch history for.
     * @param {string|null} type - The type of history to fetch. Defaults to null.
     * @param {string} templateType - The template type to use for rendering history. Defaults to 'default'.
     */
    fetchHistory(page, type, templateType = 'default') {
        let me = this;
        if (me.exec_start) return;
        me.exec_start = true;
        const data = { page, type, row_per_page: me.row_per_page };
        const url = mainProgramUrl + '/history';

        $.ajax({
            type: "GET",
            url,
            dataType: 'json',
            data,
            success: (response) => {
                me.exec_start = false;
                response.status === 1 ? me.renderHistory(response, type, templateType) : inform(response.data);
            },
            error: (response) => {
                me.exec_start = false;
                inform(response.data);
            }
        });
    },
    
    generateExchangeHistoryTemplate(pagination, row_per_page, arPackage, textSuccess, textFailed) {
        let template = `<table class="compact-table">
                            <thead>
                            <tr>
                                <th>${langs['TEXT_AWARD']}</th>
                                <th>${langs['TEXT_STATUS']}</th>
                            </tr>
                            </thead>
                            <tbody>`;
        pagination.data.forEach((item) => {
            template += `
                <tr>
                    <td>${arPackage[item.PackageID] ?? ''}</td>
                    <td>${item.PackageStatus == 1 ? textSuccess : textFailed}</td>
                </tr>
            `;
        });
        template += `</tbody></table>`;
        return template;
    },
    

    /**
     * Generates the default template for history rendering.
     * 
     * This function constructs a table template for displaying history data. It iterates over the pagination data,
     * populating the table rows with the numeric order, award name, status, and time for each item. The status is
     * determined based on the PackageStatus, displaying either 'success' or 'failed' text.
     * 
     * @param {object} pagination - The pagination object containing data and page information.
     * @param {number} row_per_page - The number of rows per page.
     * @param {object} arPackage - An object mapping PackageID to award names.
     * @param {string} textSuccess - The text to display for successful status.
     * @param {string} textFailed - The text to display for failed status.
     * @returns {string} The generated HTML template as a string.
     */
    generateDefaultTemplate(response, row_per_page, textSuccess, textFailed, textExchanged, textCode) {
        let textGiftRetry = langs['TEXT_GIFT_RETRY'];
        let pagination = response.pagination;
        let arPackage = response.packages;
        let template = `<table>
                            <thead>
                            <tr>
                                <th>${langs['TEXT_NUMERIC_ORDER']}</th>
                                <th>${langs['TEXT_AWARD']}</th>
                                <th>${langs['TEXT_STATUS']}</th>
                                <th>${langs['TEXT_TIME']}</th>
                            </tr>
                            </thead>
                            <tbody>`;
        pagination.data.forEach((item, index) => {
            let textStatus = '';
            let strShowCode = '';
            let strRetry = '';
            if(item.isMinusExchange == 1) {
                textStatus = textExchanged;
            } else if(item.GiftPackageType != this.GIFT_MODULE_GIFT_PACKAGE_OUT_GAME) {
                textStatus = item.PackageStatus == 1 ? textSuccess : textFailed;
                // handle isRetry here
                if(textStatus == textFailed && typeof response.isRetry != 'undefined' && response.isRetry == 1) {
                    let urlRetry = response.urlRetry+btoa(item.RequestID)+'&_t='+response.token;
                    strRetry = `</br><a class='retry' href='${urlRetry}'>${textGiftRetry}</a>`;

                }
            }

            if(typeof response.isShowCode != 'undefined' && response.isShowCode == 1) {
                let itemNote = item.Note;
                strShowCode = itemNote ? `</br>(${textCode}: <a type='button' class='click2copy' data-value='${itemNote}' onclick='click2copy(this)'>${itemNote}</a>)` : '';
            }
            template += `
                <tr>
                    <td>${(row_per_page * (pagination.currentPage - 1)) + index + 1}</td>
                    <td>${arPackage[item.PackageID] ?? '' }${strShowCode}</td>
                    <td>${textStatus}${strRetry}</td>
                    <td>${item.CreatedAt}</td>
                </tr>
            `;
        });
        template += `</tbody></table>`;
        return template;
    },

    generatePaymentHistoryTemplate(response, row_per_page, textSuccess, textFailed) {
        console.log('row_per_page_payment',row_per_page);
        let pagination = response.pagination;
        let arPackage = response.packages;
        let template = `<table>
                            <thead>
                            <tr>
                                <th>${langs['TEXT_NUMERIC_ORDER']}</th>
                                <th>${langs['TEXT_AWARD']}</th>
                                <th>${langs['TEXT_STATUS']}</th>
                                <th>${langs['TEXT_TIME']}</th>
                            </tr>
                            </thead>
                            <tbody>`;
        pagination.data.forEach((item, index) => {
            template += `
                <tr>
                    <td>${(row_per_page * (pagination.currentPage - 1)) + index + 1}</td>
                    <td>${arPackage[item.PackageID] ?? ''}</td>
                    <td>${item.PackageStatus == 1 ? textSuccess : textFailed}</td>
                    <td>${item.CreatedAt}</td>
                </tr>
            `;
        });
        template += `</tbody></table>`;
        return template;
    },

    paginate(currentPage, totalPage, url, paginateParam = 'page', type = null) {
        if (totalPage <= 1) return '';

        let processUrl = (page) => {
            const urlObj = new URL(url);
            urlObj.searchParams.set(paginateParam, page); // Set param for page
            if (type) {
                urlObj.searchParams.set('type', type); // Add type to URL if available
            }
            return urlObj.toString();
        };

        let html = '<nav aria-label="Page navigation example"><ul class="pm__pagination pagination">';

        // Previous button
        if (currentPage > 1) {
            html += `
                <li class="page-item">
                    <a class="page-back button-back page-link" href="${processUrl(currentPage - 1)}" data-page="${currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Prev</span>
                    </a>
                </li>`;
        }

        // Determine the start and end page limits
        const maxPagesToShow = 5; // Number of pages to show
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);

        // Adjust startPage if endPage exceeds totalPage
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Display pages from startPage to endPage
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                html += `<li class="page-item active"><a class="page-link" href="${processUrl(i)}" data-page="${i}">${i}</a></li>`;
            } else {
                html += `<li class="page-item"><a class="page-link" href="${processUrl(i)}" data-page="${i}">${i}</a></li>`;
            }
        }

        // Next button
        if (currentPage < totalPage) {
            html += `
                <li class="page-item">
                    <a class="page-next button-next page-link" href="${processUrl(currentPage + 1)}" data-page="${currentPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>`;
        }

        html += '</ul></nav>';
        return html;
    },

    renderHistory(response, type, templateType = 'default') { 
        let me = this;
        let row_per_page = me.row_per_page;
        let textSuccess = langs['TEXT_SUCCESS'];
        let textFailed = langs['TEXT_FAILED'];
        let textGiftRetry = langs['TEXT_GIFT_RETRY'];
        let textExchanged = langs['LUCKY_DRAW_GIFT_EXCHANGE_EXCHANGED'];
        let textCode = langs['TEXT_CODE'];
        let pagination = response.pagination;
        let arPackage = response.packages;
    
       
        let url = (mainProgramUrl ?? urldomainKM) + '/history';
        let templatePagination = me.paginate(pagination.currentPage, pagination.totalPage, url, 'page', type); // Pass type to pagination
    
        // Decide template based on the type
        let template = '';
    
        switch (templateType) {
            case 'default':
                template = this.generateDefaultTemplate(response, row_per_page, textSuccess, textFailed, textExchanged, textCode);
                break;
            case 'exchange':
                template = this.generateExchangeHistoryTemplate(pagination, row_per_page, arPackage, textSuccess, textFailed);
                break;
            case 'payment':
                template = this.generatePaymentHistoryTemplate(response, row_per_page, textSuccess, textFailed);
                break;
            default:
                console.warn('Unknown template type');
                break;
        }
    
        template += `<br>${templatePagination}`;
        $(me.selector.popupHistory).find('.pm__form-history').empty().append(template);
        $(me.selector.popupHistory).addClass('active');
    
        // Bind click event to pagination links
        $(me.selector.pagination + ' ' + me.selector.pageLink).on('click', function(e) {
            e.preventDefault();
            let page = $(this).data('page'); // Get new page from pagination
            if (page) {
                me.fetchHistory(page, type); // Fetch history again with new page and type
            }
        });
       
    },
    
}
$(function() {
    HistoryAjax.init();
})