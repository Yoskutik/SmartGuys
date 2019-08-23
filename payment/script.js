$(window).ready(() => {
    const child_id = new URLSearchParams(location.search).get('id');
    let fields = $('.payment__row_body');

    $('.additional').mask('00000');
    $('.custom-number-input__input').mask('000');

    $('input[type=checkbox]').on('click', () => $('.payment__row_body.total').text(`${getTotal()} ₽`));

    $('.payment__row_body.total').text(`${getTotal()} ₽`);

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

    $('#books_3').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Пособие;'))
                $('.comment__message').val(`${val} Пособие 3;`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Пособие 3;/g, '').trim());
        }
    });

    $('.custom-number-input input').on('change', () => $('.payment__row_body.total').text(`${getTotal()} ₽`));

    ['Посещаемость', 'Ментальная арифметика I', 'Ментальная арифметика II',
        'Английский язык', 'ИЗО студия', 'Дефектолог', 'Логопед', 'Психолог'].forEach((str, i) => {
        $('.custom-number-input input').eq(i)
            .on('change', function () {
                let val = $('.comment__message').val();
                val = val.replace(new RegExp(`${str} \\d+;`, 'g'), '').trim();
                $('.comment__message').val(val);
                if (+this.value > 0)
                    $('.comment__message').val(`${val} ${str} ${this.value};`.trim());
            })
            .trigger('change');
    });

    $('.additional').on('input', function () {
        $('.payment__row_body.total').text(`${getTotal()} ₽`);
        let val = $('.comment__message').val();
        val = val.replace(/Дополнительно \d+;/g, '').trim();
        $('.comment__message').val(val);
        if (+this.value > 0)
            $('.comment__message').val(`${val} Дополнительно ${+this.value};`.trim());
    });

    $('.pay').on('click', async () => {
        let fee = $('input[type=checkbox]').eq(0).is(':checked:not(:disabled)');
        let book = $('input[type=checkbox]').eq(1).is(':checked:not(:disabled)');
        let fee_3 = $('input[type=checkbox]').eq(2).is(':checked:not(:disabled)');
        let annual = {};
        if (fee) annual.fee = true;
        if (book) annual.book = true;
        if (fee_3) annual.fee_3 = true;
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
                type: +$('input[type=radio]:checked').val(),
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

    $('.look').on('click', () => createVacation());
});

function getTotal() {
    let total = 0;

    ['group', 'mental_arifm_1', 'mental_arifm_2', 'english', 'painting'].forEach((key, i) => {
        if (!data.attendance[key].passes) {
            total += $('.custom-number-input__input').eq(i).val() >= 8
                ? prices[key] * 8
                : prices[key] * $('.custom-number-input__input').eq(i).val();
        } else {
            let count = parseInt($('.custom-number-input__input').eq(i).val()) - data.attendance[key].passes;
            let c = count;
            total += count >= 8 ? prices[key] * 8 : prices[key] * count;
            total += c < 8
                ? c + data.attendance[key].ill >= 8
                    ? prices[key] / 2 * (8 - c)
                    : prices[key] / 2 * data.attendance[key].ill
                : 0;
            c += data.attendance[key].ill;
            total += c < 8
                ? c + data.attendance[key].passes - data.attendance[key].ill >= 8
                    ? prices[key] * (8 - c)
                    : prices[key] * (data.attendance[key].passes - data.attendance[key].ill)
                : 0;
        }
    });

    if ($('.additional').is(':visible')) {
        total += parseInt($('.additional').val() || '0');
    }
    if ($('#fee').is(':checked:not(:disabled)'))
        total += prices.fee;
    if ($('#books').is(':checked:not(:disabled)'))
        total += prices.books;
    if ($('#books_3').is(':checked:not(:disabled)'))
        total += prices.books_3;
    total += prices.defectologist * $('.custom-number-input__input').eq(5).val();
    total += prices.logopedist * $('.custom-number-input__input').eq(6).val();
    total += prices.psychologist * $('.custom-number-input__input').eq(7).val();
    return total;
}

function createVacation() {
    let w = '440';
    let h = '590';
    let title = '';
    let url = encodeURI(`/payment/voucher/?${[
        `fio=${data.fio}`,
        `group=${$('.custom-number-input__input').eq(0).val()}/${data.attendance.group.passes}/${data.attendance.group.ill}`,
        `mental_arifm_1=${$('.custom-number-input__input').eq(1).val()}/${data.attendance.mental_arifm_1.passes}/${data.attendance.mental_arifm_1.ill}`,
        `mental_arifm_2=${$('.custom-number-input__input').eq(2).val()}/${data.attendance.mental_arifm_2.passes}/${data.attendance.mental_arifm_2.ill}`,
        `english=${$('.custom-number-input__input').eq(3).val()}/${data.attendance.english.passes}/${data.attendance.english.ill}`,
        `painting=${$('.custom-number-input__input').eq(4).val()}/${data.attendance.painting.passes}/${data.attendance.painting.ill}`,
        `defectologist=${$('.custom-number-input__input').eq(5).val()}`,  
        `logopedist=${$('.custom-number-input__input').eq(6).val()}`,  
        `psychologist=${$('.custom-number-input__input').eq(7).val()}`,
        `fee=${$('#fee').is(':checked:not(:disabled)') ? 1 : 0}`,
        `books=${$('#books').is(':checked:not(:disabled)') ? 1 : 0}`,
        `books_3=${$('#books_3').is(':checked:not(:disabled)') ? 1 : 0}`,
        `additional=${$('.additional').val()}`,
        `total=${getTotal()}`,
        `type=${+$('input[type=radio]:checked').val()}`,
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