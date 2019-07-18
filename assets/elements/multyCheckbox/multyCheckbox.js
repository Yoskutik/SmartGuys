$(window).ready(() => {
    $(document).on('click', '.multyCheckbox .multyCheckbox__item', function() {
        let el = $(this);
        if (el.parent().hasClass('disabled')) return;
        el.hide();
        let next = el.next();
        if (next.length === 0)
            el.parent().find('.multyCheckbox__item').eq(0).show();
        else
            next.show();
    });
});