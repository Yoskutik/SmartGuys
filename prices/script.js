$(window).ready(() => {
    $(document).on('click', '.change', function(e) {
        $('input').removeAttr('disabled')
            .each((i, el) => {
               el.value = el.value.replace(' ₽', '');
            });
        $(this).text('Сохранить')
            .toggleClass('change save');
    });

    $(document).on('click', '.save', function () {
        let prices = {};
        $('.prices__item').each((i, el) => {
            prices[el.dataset.id] = {
                price: +$(el).find('input').val(),
            }
        });
        $.ajax({
            url: '/api/updatePrices',
            type: 'post',
            data: prices,
            success: () => {
                toast('Изменения сохранены.');
                $('input').prop('disabled', true)
                    .each((i, el) => {
                        el.value = el.value + ' ₽';
                    });
                $(this).text('Изменить')
                    .toggleClass('change save');
            },
            error: () => {
                toast('Что-то пошло не так.');
            }
        })
    });
});