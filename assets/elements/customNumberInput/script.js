$(window).ready(() => {
    if ($().mask) $('.custom-number-input__input').mask('000');
    $('.custom-number-input__up').on('click', function () {
        let input = $(this).parent().find('.custom-number-input__input');
        let tmp = input.val() || '0';
        input.val(parseInt(tmp) + 1);
        input.trigger('change');
    });
    $('.custom-number-input__down').on('click', function () {
        let input = $(this).parent().find('.custom-number-input__input');
        let tmp = input.val() || '0';
        input.val(parseInt(tmp) - 1);
        input.trigger('change');
    });
});