
$(document).ready(function () {
    const contentContainer = $('#container');
    const Filter_Bar = $('#Filter_Bar');
    const filters = $('#filters');
    let filterList = [];

    $(document).on('click', '.filter', function() {
        filter(this);
    });
    
    $(document).on('click', '.Filter_Button', function() {
        filter(this);
    });

    $(document).on('click', '.addJob_Button', function() {
        $('#addJobOverlay').show();
    });

    $(document).on('click', '#closeJob_Button', function() {
        $('#addJobOverlay').hide();
    });

    $(document).on('click', '.endJob_Button', function() {
        $(this).closest('.card').remove();
    });

    $(document).on('click', '.cardDetails_Button', function() {
        $('#JobDetailsOverlay').show();
    });

    $(document).on('click', '.cardClose_Button', function() {
        $('#JobDetailsOverlay').hide();
    });

    function getData() {
        return new Promise((resolve, reject) => {
            $.getJSON('./data.json', function (data) {
                console.log(data);
                resolve(data);
            }).fail(function (err) {
                reject(err);
            });
        });
    }

    function checkFilter(compareList) {
        return filterList.every(function (el) {
            return compareList.indexOf(el) >= 0;
        });
    }

    async function renderMainContent() {
        contentContainer.html('');
        const data = await getData();
        data.forEach(function (item) {
            const itemFilters = [item.role, item.level, ...(item.languages || []), ...(item.tools || [])];
            if (filterList.length === 0 || checkFilter(itemFilters)) {
                let filterContent = '';
                itemFilters.forEach(function (filter) {
                    filterContent += `<div class="filter" data-value="${filter}">${filter}</div>`;
                });
                const infoNew = item.new ? `<div class="tag bg-light">New!</div>` : '';
                const infoFeatured = item.featured ? `<div class="tag bg-dark">Featured</div>` : '';
                contentContainer.append(`
                    <div class="card">
                        <img src="${item.logo}" alt="logo-${item.company}"/>
                        <div class="grid-item">
                            <div class="info">
                                <div class="info-heading">
                                    <h6>${item.company}</h6>
                                    ${infoNew}
                                    ${infoFeatured}
                                </div>
                                <h4>${item.position}</h4>
                                <div class="info-status">
                                    <div class="status">${item.postedAt} &centerdot;</div>
                                    <div class="status">${item.contract} &centerdot;</div>
                                    <div class="status">${item.location}</div>
                                </div>
                            </div>
                            <button class="endJob_Button">X</button>
                            <button class="cardDetails_Button">Info</button>
                            <hr class="divider">
                            <div class="filters">${filterContent}</div>
                            
                            
                        </div>
                    </div>`);
            }
        });
    }

    function renderFilter_Bar() {
        if (filterList.length === 0) {
            Filter_Bar.removeClass('show').addClass('hide');
        } else {
            Filter_Bar.removeClass('hide').addClass('show');
        }
        const Filter_BarContent = filterList.map(function (filter) {
            return `<div class="Filter_Button" data-value="${filter}">
                <p>${filter}</p>
                    <img class="cross" src="./images/icon-remove.svg">
            </div>`;
        });
        filters.html('');
        Filter_BarContent.forEach(function (item) {
            filters.append(item);
        });
        renderMainContent();
    }

    function filter(element) {
        const filterValue = $(element).attr('data-value');

        if (filterList.includes(filterValue)) {
            filterList = filterList.filter(function (filter) {
                return filter !== filterValue;
            });
            renderFilter_Bar();
        } else {
            filterList.push(filterValue);
            renderFilter_Bar();
        }
    }

    $('#Clear_Button').click(function () {
        filterList = [];
        renderFilter_Bar();
    });

    renderMainContent();
});