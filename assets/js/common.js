const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// if ($.cookie('admin').length === 0 && window.location.href)

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function copy(copy, title, desrciption) {
    copyToClipboard(copy);
    toast(title, desrciption);
}

$(window)
    .ready(() => {
        $('.logout').on('click', () => $.removeCookie('admin', {path: '/'}));
    })
    .on('load', () => {
        console.timeEnd('Loaded');

        $('.main-loader')
            .on('transitionend', e => {
                $(e.target).remove();
            })
            .css('opacity', 0);
    });

function toast(text) {
    $('body').append(`
    <div class="bg-dark text-white toast">
        <div class="toast-header bg-dark text-white">
            <span class="mr-auto">«Умники и умницы»</span>
            <small style="margin-left: 5px">Только что</small>
            <button type="button" class="ml-2 mb-1 close">
                <span>&times;</span>
            </button>
        </div>
        <div class="toast-body">
            ${text}
        </div>
    </div>
    `);

    let el = $('.toast').last();
    $('.toast .close').last().on('click', () => {
        el.css({
            transform: 'translate(0, 100px)',
            opacity: 0
        }).on('transitionend', event => $(event.target).remove());
    });

    setTimeout(() => {
        $('.toast').last().css({
            transform: 'translate(0,0)',
            opacity: 1,
        }, 200)
    });

    sleep(5000).then(() => el.find('.close').trigger('click'));
}

function getTime(w) {
    let date = new Date();
    if (w !== undefined) {
        w = parseInt(w);
        date.setTime(date.getTime() + (1 + w - date.getDay()) * 24 * 60 * 60 * 1000);
    }
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${date.getFullYear()}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`;
}