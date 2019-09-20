$(window).ready(() => {
    const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const types = [];
    $('.multyCheckbox__item:visible').each((i, el) => types.push($(el).index()));

    const updateTime = () => {
        let h = new Date().getHours();
        let m = new Date().getMinutes();
        $('.form__schedule_weekday')
            .text(weekdays[new Date().getDay() - 1]);
        $('.form__schedule_time')
            .text(`${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}`);
    };

    setInterval(updateTime, 1000);
    updateTime();

    let params = new URLSearchParams(window.location.search);
    if (params.get('new_admin')) {
        toast(`Вы зашли под именем ${params.get('new_admin')}`);
        $.cookie('admin', params.get('new_admin'), {

        });
    }

    $('.form__schedule_children-item .li div').on('click', function() {
        window.open(`${window.location.origin}/child/?id=${$(this).parent().data('id')}`);
    });

    $('.send').on('click', function() {
        let b = true;
        $('.multyCheckbox__item:visible').each((i, el) => {
            if (!types[i]) return;
            if ($(el).index() === 0) {
                b = false;
                $(el).hide()
                    .parent().addClass('border-danger')
                    .find('.multyCheckbox__item').eq(0).show();
            }
        });
        if (!b) return;
        let attendance = [];
        $('.li').each((i, el) => {
            attendance.push({
                child_id: $(el).data('id'),
                time: getTime(),
                type: $(el).find('.multyCheckbox__item:visible').index(),
                lesson_type: $(el).data('lesson-type'),
            })
        });

        $.ajax({
            url: '/api/addAttendance',
            type: 'post',
            data: { attendance },
            success: () => toast('Посещаемость отмечена'),
        })
    });

    $('.multyCheckbox').on('click', function () {
        $(this).removeClass('border-danger');
    });

    $('.today_calculation').on('click', () => {
        $.ajax({
            url: '/api/getTodayPayment',
            type: 'post',
            data: {},
            success: data => {
                toast(`Безналичный: ${data.nonCash} ₽, Наличный: ${data.cash} ₽`);
            }
        });
    });
});