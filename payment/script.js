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
            if (!val.includes('Посещаемость,'))
                $('.comment__message').val(`${val} Посещаемость,`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Посещаемость,/g, '').trim());
        }
    });

    $('#fee').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Ежегодный взнос,'))
                $('.comment__message').val(`${val} Ежегодный взнос,`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Ежегодный взнос,/g, '').trim());
        }
    });

    $('#book').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Пособие,'))
                $('.comment__message').val(`${val} Пособие,`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Пособие,/g, '').trim());
        }
    });

    $('#fee_3').on('click', function() {
        if (this.checked) {
            let val = $('.comment__message').val();
            if (!val.includes('Пособие,'))
                $('.comment__message').val(`${val} Пособие 3,`.trim());
        } else {
            $('.counter, .price__visit').hide();
            let val = $('.comment__message').val();
            $('.comment__message').val(val.replace(/Пособие 3,/g, '').trim());
        }
    });

    $('.custom-number-input input').on('change', () => $('.payment__row_body.total').text(`${getTotal()} ₽`));

    $('.payment__row.nonAnnual').each((i, el) => {
        el = $(el);
        let title = el.find('.payment__row_title').text();
        el.find('.custom-number-input input')
            .on('change', function () {
                if (el.find('input[type=checkbox]').is(':not(:checked)')) return;
                let val = $('.comment__message').val();
                val = val.replace(new RegExp(`${title} \\d+ р.,`, 'g'), '').trim();
                $('.comment__message').val(val);
                if (+this.value > 0)
                    $('.comment__message').val(`${val} ${title} ${this.value} р.,`.trim());
            })
            .trigger('change');

        el.find('input[type=checkbox]')
            .on('click', function () {
                let val = $('.comment__message').val();
                if (this.checked)
                    $(this).parent().find('.custom-number-input')
                        .find('input').trigger('change');
                else
                    $('.comment__message').val(val.replace(new RegExp(`${title} \\d+ р\.,`, 'g'), '').trim());
            });
    });

    $('.additional').on('input', function () {
        $('.payment__row_body.total').text(`${getTotal()} ₽`);
        let val = $('.comment__message').val();
        val = val.replace(/Дополнительно \d+ ₽,/g, '').trim();
        $('.comment__message').val(val);
        if (+this.value > 0)
            $('.comment__message').val(`${val} Дополнительно ${+this.value} ₽,`.trim());
    });

    $('.pay').on('click', async () => {
        let fee = $('#fee').is(':checked:not(:disabled)');
        let book = $('#book').is(':checked:not(:disabled)');
        let fee_3 = $('#fee_3').is(':checked:not(:disabled)');
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
        let [, , h, m] = new Date().toString().match(/\d+/g);
        let total = getTotal();
        let comment = $('.comment__message').val().trim();
        comment = comment.charAt(comment.length - 1) === ',' ?  comment.substring(0, comment.length - 1) : comment;
        $.ajax({
            url: '/api/pay',
            type: 'post',
            data: {
                amount: total,
                time: `${getTime()} ${h}:${m}`,
                comment: comment,
                type: +$('input[type=radio]:checked').val(),
                child_id,
            },
            success: () => {
                let w = createVacation();
                w.onafterprint = () => {
                    w.close();
                    $.cookie('payed', `За ${data.fio} заплачено ${total} ₽`, { path: '/children/' });
                    location.href = '/children/';
                };
                w.onload = () => w.print();
            },
        });

    });

    $('.look').on('click', () => createVacation());
});

function getTotal() {
    let total = 0;

    ['group', 'english', 'painting'].forEach((key, i) => {
        if ($(`#${key}`).is(':not(:checked)')) return;
        let count = parseInt($(`.custom-number-input__input.${key}`).val());
        if (!data.attendance[key].passes) {
            total += count >= 8 ? prices[key] * 8 : prices[key] * count;
        } else {
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
        total += +prices.fee;
    if ($('#book').is(':checked:not(:disabled)'))
        total += +prices.book;
    if ($('#fee_3').is(':checked:not(:disabled)'))
        total += +prices.fee_3;

    total += prices.defectologist * $('.custom-number-input__input.defectologist').val();
    total += prices.logopedist * $('.custom-number-input__input.logopedist').val();
    total += prices.psychologist * $('.custom-number-input__input.psychologist').val();

    ['mental_arifm_1', 'mental_arifm_2', 'speed_read_1', 'speed_read_2'].forEach(id => {
        if ($(`#${id}`).is(':checked'))
            total += prices[id] * (+$(`.custom-number-input__input.${id}`).val()
                + data.attendance[id].passes - data.attendance[id].ill
                + data.attendance[id].ill / 2);
    });

    return total;
}

String.prototype.toCamelCase = function () {
    return this.toLowerCase()
        .replace( /[-_]+/g, ' ')
        .replace( /[^\w\s]/g, '')
        .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
        .replace( / /g, '' );
};

function createVacation() {
    let title = 'Кассовый чек';
    let url = encodeURI(`/payment/voucher/?${[
        `fio=${data.fio}`,
        `group=${$('.custom-number-input__input.group').val()}/${data.attendance.group.passes}/${data.attendance.group.ill}`,
        `mental_arifm_1=${$('.custom-number-input__input.mental_arifm_1').val()}/${data.attendance.mental_arifm_1.passes}/${data.attendance.mental_arifm_1.ill}`,
        `mental_arifm_2=${$('.custom-number-input__input.mental_arifm_2').val()}/${data.attendance.mental_arifm_2.passes}/${data.attendance.mental_arifm_2.ill}`,
        `english=${$('.custom-number-input__input.english').val()}/${data.attendance.english.passes}/${data.attendance.english.ill}`,
        `painting=${$('.custom-number-input__input.painting').val()}/${data.attendance.painting.passes}/${data.attendance.painting.ill}`,
        `defectologist=${$('.custom-number-input__input.defectologist').val()}`,  
        `logopedist=${$('.custom-number-input__input.logopedist').val()}`,  
        `psychologist=${$('.custom-number-input__input.psychologist').val()}`,
        `fee=${$('#fee').is(':checked:not(:disabled)') ? 1 : 0}`,
        `book=${$('#book').is(':checked:not(:disabled)') ? 1 : 0}`,
        `fee_3=${$('#fee_3').is(':checked:not(:disabled)') ? 1 : 0}`,
        `additional=${$('.additional').val()}`,
        `total=${getTotal()}`,
        `admin=${$.cookie('admin')}`,
        `type=${+$('input[type=radio]:checked').val()}`,
        `speed_read_1=${$('.custom-number-input__input.speed_read_1').val()}/${data.attendance.speed_read_1.passes}/${data.attendance.speed_read_1.ill}`,
        `speed_read_2=${$('.custom-number-input__input.speed_read_2').val()}/${data.attendance.speed_read_2.passes}/${data.attendance.speed_read_2.ill}`,
    ].join('&')}`);
    return window.open(url, title);
}