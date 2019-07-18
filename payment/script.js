$(window).ready(() => {
    const child_id = new URLSearchParams(window.location.search).get('id');
    let fields = $('.payment__row_body');

    $('.individual').mask('00000');

    $('input[type=checkbox]').on('click', () => {
        $('.danger').hide();
        $('.payment__row_body.total').text(`${getTotal()} ₽`);
    });

    $('#attendance').on('click', function() {
        if (this.checked) {
            $('.counter, .price__visit').css('display', 'flex');
            let val = $('.comment__message').val();
            if (!val.includes('Посещаемость;'))
                $('.comment__message').val(`${val} Посещаемость;`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Посещаемость;/g, '').trim());
        }
    });

    $('#individual').on('click', function() {
        if (this.checked) {
            $('.price__individual').css('display', 'flex');
            let val = $('.comment__message').val();
            if (!val.includes('Индивидуальные занятия;'))
                $('.comment__message').val(`${val} Индивидуальные занятия;`.trim());
        } else {
            $('.price__individual').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Индивидуальные занятия;/g, '').trim());
        }
    });

    $('#fee').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Ежегодный взнос;'))
                $('.comment__message').val(`${val} Ежегодный взнос;`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Ежегодный взнос;/g, '').trim());
        }
    });

    $('#books').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Пособие;'))
                $('.comment__message').val(`${val} Пособие;`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Пособие;/g, '').trim());
        }
    });

    $('.custom-number-input input').on('change', function () {
        $('.payment__row_body.total').text(`${getTotal()} ₽`);
    });

    $('.individual').on('input', function () {
        $('.payment__row_body.total').text(`${getTotal()} ₽`);
    });

    $('.pay').on('click', async () => {
        if (!$('input[type=checkbox]').is(':checked:not(:disabled)')) {
            $('.danger').show();
            return;
        }
        let fee = $('input[type=checkbox]').eq(1).is(':checked:not(:disabled)');
        let book = $('input[type=checkbox]').eq(2).is(':checked:not(:disabled)');
        let annual = {};
        if (fee) annual.fee = true;
        if (book) annual.book = true;
        let annualPost;
        if (!$.isEmptyObject(annual)) {
            annualPost = new Promise(resolve => {
                $.ajax({
                    url: '/api/payAnnual',
                    type: 'post',
                    data: {
                        ...annual,
                        time: getTime(),
                        child_id,
                    },
                    success: () => resolve(),
                })
            });
        }
        await annualPost;
        $.ajax({
            url: '/api/pay',
            type: 'post',
            data: {
                amount: getTotal(),
                time: getTime(),
                comment: $('.comment__message').val(),
                child_id,
            },
            success: () => {
                let w = createVacation();
                w.onload = () => {
                    w.print();
                    w.close();
                    location.reload();
                }
            },
        });

    });

    $('.look').on('click', () => {
        if (!$('input[type=checkbox]').is(':checked:not(:disabled)')) {
            $('.danger').show();
            return;
        }
        createVacation();
    });
});

function getTotal() {
    let total = 0;
    if ($('#attendance').is(':checked:not(:disabled)')) {
        let count = parseInt($('.custom-number-input__input').val()) - data.passes;
        let c = count;
        total += count > 8 ? prices.visit * 8 : prices.visit * count;
        total += c < 8
            ? c + data.passesIll > 8
                ? prices.visit / 2 * (8 - c)
                : prices.visit / 2 * data.passesIll
            : 0;
        c += data.passesIll;
        total += c < 8
            ? c + data.passes - data.passesIll > 8
                ? prices.visit * (8 - c)
                : prices.visit * (data.passes - data.passesIll)
            : 0;
    }
    if ($('.individual').is(':visible')) {
        total += parseInt($('.individual').val() || '0');
    }
    if ($('#fee').is(':checked:not(:disabled)'))
        total += prices.fee;
    if ($('#books').is(':checked:not(:disabled)'))
        total += prices.books;
    return total;
}

function createVacation() {
    let w = '440';
    let h = '590';
    let title = '';
    let url = encodeURI(`/payment/voucher/?${[
        'fio=' + data.fio,
        'count=' + $('.custom-number-input__input').val(),
        'passes=' + data.passes,
        'passesIll=' + data.passesIll,
        'attendance=' + $('#attendance').is(':checked:not(:disabled)'),  
        'individual=' + $('#individual').is(':checked:not(:disabled)'),  
        'individual_price=' + $('.individual').val(),  
        'fee=' + $('#fee').is(':checked:not(:disabled)'),
        'books=' + $('#books').is(':checked:not(:disabled)'),
        'type=' + $('input[type=radio]:checked').val(),
        'total=' + getTotal(),
    ].join('&')}`);
    let dualScreenLeft = window.screenLeft || window.screenX;
    let dualScreenTop = window.screenTop || window.screenY;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let systemZoom = width / window.screen.availWidth;
    let left = (width - w) / 2 / systemZoom + dualScreenLeft;
    let top = (height - h) / 2 / systemZoom + dualScreenTop;
    return window.open(
        url,
        title,
        'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left
    );
}