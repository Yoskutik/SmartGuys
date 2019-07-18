$(window).ready(() => {
    let attend = [{}, {}, {}, {}, {}, {}, {}];

    $('.navigation__link').on('click', e => {
        $('.navigation__link.active').removeClass('active');
        e.target.classList.add('active');
    });

    $('.navigation__teachers').on('click', () => $('.schedule > div').css('transform', 'translateX(0)'));
    $('.navigation__children').on('click', () => $('.schedule > div').css('transform', 'translateX(-100%)'));

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
        attend[el.closest('.schedule__weekday').index()]
            [el.closest('li').data('id')] = [
                (el.find('.multyCheckbox__item:visible').index() + 1) % 4,
                el.closest('li').data('lesson-type'),
            ];
    });

    $('.schedule__btns .add').on('click', () => {
        let attendance = [];
        attend.forEach((day, i) => {
            Object.keys(day).forEach(id => {
                if (day[id] === 0) return;
                attendance.push({
                    child_id: id,
                    time: getTime(i),
                    type: day[id][0],
                    lesson_type: day[id][1],
                })
            });
        });
        $.ajax({
            url: '/api/addAttendance',
            type: 'post',
            data: { attendance },
            success: () => {
                toast('Посещаемость отмечена');
            },
        });
    });
});