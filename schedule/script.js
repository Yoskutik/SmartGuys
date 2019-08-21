$(window).ready(() => {
    let attendance = [];

    $('.schedule').css('max-height', `${$('.schedule__teachers')[0].scrollHeight}px`);

    $('.navigation__link').on('click', e => {
        $('.navigation__link.active').removeClass('active');
        e.target.classList.add('active');
    });

    $('.navigation__teachers').on('click', () => {
        $('.schedule > div').css('transform', 'translateX(0)');
        $('.schedule').css('max-height', `${$('.schedule__teachers')[0].scrollHeight}px`);
    });

    $('.navigation__children').on('click', () => {
        $('.schedule > div').css('transform', 'translateX(-100%)');
        $('.schedule').css('max-height', `${$('.schedule__children')[0].scrollHeight}px`);
    });

    $('.child-item').on('click', function () {
        window.open(`${window.location.origin}/child/?id=${$(this).parent().data('id')}`);
    });

    $('.teacher-item div').on('click', function() {
        let el = $(this).parent().find('.inner');
        if (parseInt(el.css('max-height')) === 0) {
            el.css('max-height', `${el[0].scrollHeight}px`)
        } else {
            el.css('max-height', '0px');
        }
    });

    $('.alert .close').on('click', function () {
        $(this).parent().hide();
    });

    $('.multyCheckbox').on('click', function () {
        let el = $(this);
        attendance = attendance.filter(row => {
            return !(row.time === getTime(el.closest('.schedule__weekday').index())
                && row.child_id === el.closest('li').data('id')
                && row.lesson_type === el.closest('li').data('lesson-type'));
        });
        attendance.push({
            time: getTime(el.closest('.schedule__weekday').index()),
            child_id: el.closest('li').data('id'),
            lesson_type: el.closest('li').data('lesson-type'),
            type: (el.find('.multyCheckbox__item:visible').index() + 1) % 4,
        });
    });

    $('.schedule__btns .add').on('click', () => {
        $.ajax({
            url: '/api/addAttendance',
            type: 'post',
            data: { attendance },
            success: () => {
                toast('Посещаемость отмечена');
                attendance = [];
            },
        });
    });
});