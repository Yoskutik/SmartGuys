$(window).ready(() => {
    const child_id = new URLSearchParams(window.location.search).get('id');
    const vacationPeriod = $('input[name=vacation]').val();
    let attend = {};

    $('input[name=vacation]').mask('00.00.0000-00.00.0000');
    $('input[name=date]').mask('00.00.0000');
    $('input[name=vacation]').on('click', () => $('input[name=vacation]').removeClass('border-danger'));

    let attendanceIdForRemove = [];
    $('.info__attendance .remove').hide();

    $(document).on('click', '.children__add_buttons .change', function() {
        $('input[disabled]').removeAttr('disabled');
        $('select[disabled]').removeAttr('disabled');
        $('.multyCheckbox.disabled').removeClass('disabled');
        $('.children__add_schedule.disabled').removeClass('disabled');
        $(this).toggleClass('change save').text('Сохранить');
    });

    $(document).on('click', '.children__add_buttons .save', async function() {
        if (!verifyInputs()) return;
        if (vacationPeriod && !$('input[name=vacation]').val().match(/\d\d\.\d\d\.\d\d\d\d-\d\d\.\d\d\.\d\d\d\d/)) {
            $('input[name=vacation]').addClass('border-danger');
            return;
        }

        let vacation;
        if ($('input[name=vacation]').val().length > 0) {
            vacation = new Promise(resolve => {
                $.ajax({
                    url: '/api/addVacation',
                    type: 'post',
                    data: {
                        child_id,
                        period: $('input[name=vacation]').val(),
                        year: new Date().getFullYear(),
                    },
                    success: () => resolve(),
                })
            })
        }
        await vacation;

        let input = $('input');

        let child = {
            fio: input.eq(0).val(),
            birthday: input.eq(1).val(),
            parent_1_fio: input.eq(2).val(),
            parent_1_tel: input.eq(3).val(),
            parent_2_fio: input.eq(4).val(),
            parent_2_tel: input.eq(5).val(),
        };

        let schedule = [];
        $('.children__add_schedule').each((i, el) => {
            el = $(el);
            schedule.push({
                weekday: el.find(':selected').index() - 1,
                time: el.find('.time').val(),
                type: el.find('.multyCheckbox__item:visible').index(),
                teacher_id: el.find('.fio').data('id'),
            })
        });

        $.ajax({
            url: '/api/updateChild',
            type: 'post',
            data: {
                id: child_id,
                child,
                schedule,
            },
            success: data => {
                $('input:not([disabled])').attr('disabled', true);
                $('select:not([disabled])').attr('disabled', true);
                $('.multyCheckbox:not(.disabled)').addClass('disabled');
                $('.children__add_schedule:not(.disabled)').addClass('disabled');
                $(this).toggleClass('change save').text('Изменить');
                toast('Изменения сохранены');
            }
        });
    });

    $('.children__add_buttons .payment').on('click', () => {
        if (confirm(`Начать оплату за ${$('input[name=fio]').val()}?`))
            window.location.href = `${window.location.origin}/payment/?id=${child_id}`;
    });

    $('.children__add_buttons .delete').on('click', async() => {
        if (!confirm(`Удалить ${$('input[name=fio]').val()}?`)) return;
        $.ajax({
            url: '/api/removeChild',
            type: 'post',
            data: {
                id: child_id,
            },
            success: () => {
                location.reload();
            }
        });
    });

    $(document).on('click', '.multyCheckbox', function () {
        attend[$(this).closest('li').data('time')] = [
            $(this).find('.multyCheckbox__item:visible').index(),
            $(this).closest('li').data('lesson-type'),
        ];
    });

    $(document).on('click', '.info__attendance .change', function () {
        $('.multyCheckbox.disabled').removeClass('disabled');
        $(this).parent().parent().find('.remove').show();
        $(this).toggleClass('change save').text('Сохранить');
    });

    $(document).on('click', '.info__attendance .save', async function () {
        if (!confirm('Сохранить изменения?')) return;

        let deleting = new Promise(resolve => {
            $.ajax({
                url: '/api/removeAttendance',
                type: 'post',
                data: {
                    ids: attendanceIdForRemove,
                },
                success: () => {
                    attendanceIdForRemove = [];
                    resolve();
                },
            })
        });
        await deleting;

        let attendance = [];
        for (let time in attend) {
            if (attend[time] === 0) continue;
            attendance.push({
                child_id,
                time,
                type: attend[time][0],
                lesson_type: attend[time][1],
            });
        }
        $.ajax({
            url: '/api/addAttendance',
            type: 'post',
            data: { attendance },
            success: () => {
                toast('Посещаемость отмечена');
                $('.multyCheckbox').addClass('disabled');
                $(this).toggleClass('change save').text('Изменить');
            },
        });
    });

    $('.add-child-attendance .close').on('click', function () {
        let parent = $(this).parent().parent();
        parent.find('input[name=date]').val('');
        parent.find('.multyCheckbox__item:visible').hide();
        parent.find('.multyCheckbox__item').eq(0).show();
        parent.find('.multyCheckbox__item').eq(7).show();
        parent.hide();
    });

    $('.add-child-attendance .add').on('click', function () {
        let parent = $(this).parent().parent();
        let valid = true;
        if (!parent.find('input[name=date]').val().match(/\d\d\.\d\d\.\d\d\d\d/)) {
            valid = false;
        }
        if (parent.find('.multyCheckbox__item:visible').eq(0).index() === 0) {
            valid = false;
        }
        if (parent.find('.multyCheckbox__item:visible').eq(1).index() === 0) {
            valid = false;
        }
        if (!valid) {
            toast('Заполнены не все поля');
            return;
        }

        let day = parent.find('input[name=date]').val();
        let [dd, mm, yyyy] = day.match(/\d+/g);
        $.ajax({
            url: '/api/addAttendance',
            type: 'post',
            data: {
                attendance: [{
                    child_id,
                    lesson_type: parent.find('.multyCheckbox__item:visible').eq(0).index(),
                    type: parent.find('.multyCheckbox__item:visible').eq(1).index(),
                    time: `${yyyy}-${mm}-${dd}`,
                }]
            },
            success: () => {
                parent.find('.close').trigger('click');
                toast('Посещаемость добавлена');
            },
            error: toast('Что-то пошло не так')
        });
    });

    $('.attendance__btns .add').on('click', () => $('.add-child-attendance').show());

    $('.info__attendance .remove').on('click', function() {
        $(this).parent().parent().hide();
        attendanceIdForRemove.push($(this).parent().parent().data('id'));
    });
});