$(window).ready(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $('input[name=tel]').mask('+7(000)000-00-00');
    $('input[name=birthday]').mask('00.00.0000');
    $('.time').mask('00:00-00:00');

    $('input').on('focus', e => e.target.classList.remove('border-danger'));
    $('.multyCheckbox').on('click', e => $(e.target).parent().removeClass('border-danger'));

    if ($.cookie('payed')) {
        toast($.cookie('payed'));
        $.cookie('payed', '', { path: '/children/', expires: -1 });
    }

    $('.children__add_buttons .add').on('click', () => {
        if (!verifyInputs()) return;
        let input = $('input');
        if(!confirm(`Добавить ребенка ${input[1].value}?`)) return;

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

        let child = {
            fio: input[1].value.capitalyzeAll(),
            birthday: input[2].value,
            parent_1_fio: input[3].value.capitalyzeAll(),
            parent_1_tel: input[4].value,
            parent_2_fio: input[5].value.capitalyzeAll(),
            parent_2_tel: input[6].value,
        };

        $.ajax({
            url: '/api/addChild',
            type: 'post',
            data: {
                child,
                schedule,
            },
            success: data => {
                if (data.status === 'OK') {
                    let input = $('input');
                    toast(`${input.eq(1).val()} был(а) добавлен в систему`);
                    input.val('');
                    $('.weekdays').val('День недели');
                    $('.multyCheckbox__item:visible').hide();
                    $('.multyCheckbox__item:first-child').show();
                }
            }
        })
    });

    let onInputEnd;
    $(document).on('input', '.children__add_schedule .fio', function () {
        clearTimeout(onInputEnd);
        onInputEnd = setTimeout(() => {
            if (this.value.length === 0) {
                $(this).parent().find('.children__add_schedule_teachers').html('').hide();
                return;
            }
            $.ajax({
                url: '/api/getTeacher',
                type: 'post',
                data: {fio: this.value.toLowerCase().capitalyze()},
                success: data => {
                    let list = $(this).parent().find('.children__add_schedule_teachers').show();
                    list.css('width', $(this).css('width')).html('');
                    data.forEach(teacher => list.append(`<li data-id="${teacher.id}">${teacher.fio}</li>`));
                }
            })
        }, 700);
    });

    $('.children__finder input').on('input', function() {
        clearTimeout(onInputEnd);
        onInputEnd = setTimeout(() => {
            if (this.value.length === 0) {
                $(this).parent().parent().find('.children__finder_list').html('').hide();
                return;
            }
            $.ajax({
                url: '/api/getChild',
                type: 'post',
                data: {fio: this.value.toLowerCase().capitalyze()},
                success: data => {
                    let list = $(this).parent().parent().find('.children__finder_list').show();
                    list.css('width', $(this).css('width')).html('');
                    data.forEach(child => {
                        let [dd, mm, yyyy] = child.birthday.match(/\d+/g).map(d => parseInt(d));
                        let years = new Date().getFullYear() - new Date(`${months[mm-1]} ${dd} ${yyyy}`).getFullYear();
                        list.append(`
                            <li data-id="${child.id}">${child.fio}
                                <small>${years} ${years === 1 ? 'год' : years > 4 ? 'лет' : 'года'}</small>
                            </li>
                        `);
                    });
                }
            })
        }, 700);
    });

    $(document).on('click', '.children__finder_list li', function () {
        window.location.href = `${window.location.origin}/child/?id=${$(this).data('id')}`;
    });

    $(document).on('click', '.children__add_schedule_teachers li', function () {
        let schedule = $(this).parent().hide().html('').parent();
        schedule.find('.fio').val($(this).text()).attr('data-id', $(this).data('id'));
    });

    $(document).on('click', '.children__add_schedule .remove', function() {
        let el = $(this).parent();
        el.prev().remove();
        el.remove();
    });

    $('.children__add_schedule .add').on('click', () => {
        $('.children__add_form').append(`
            <span></span>
            <div class="children__add_schedule">
                <span class="multyCheckbox multyCheckbox_type">
                     <span class="multyCheckbox__item" style="background: white"></span>
                     <span class="multyCheckbox__item" style="background: #8869bf; display: none">Груп</span>
                     <span class="multyCheckbox__item" style="background: #5f6693; display: none">Ма 1</span>
                     <span class="multyCheckbox__item" style="background: #75ced2; display: none">Ма 2</span>
                     <span class="multyCheckbox__item" style="background: #6a6683; display: none">Англ</span>
                     <span class="multyCheckbox__item" style="background: #94d7d6; display: none">ИЗО</span>
                     <span class="multyCheckbox__item" style="background: #bfb069; display: none">Инд</span>
                </span>
                <select class="custom-select weekdays">
                    <option disabled selected>День недели</option>
                    <option>Понедельник</option>
                    <option>Вторник</option>
                    <option>Среда</option>
                    <option>Четверг</option>
                    <option>Пятница</option>
                    <option>Суббота</option>
                    <option>Воскресенье</option>
                </select>
                <input name="time" class="time" type="text" placeholder="Время">
                <input class="fio" type="text" placeholder="ФИО учителя">
                <ul class="children__add_schedule_teachers dropdown_list"></ul>
                <span class="remove"></span>
            </div>
        `);
        $('.time').mask('00:00-00:00');
        $('.children__window_add button').trigger('click');
    });

    $('.children__window_add button').on('click', () => {
        $('.children__add').css('max-height', `${$('.children__add')[0].scrollHeight}px`);
        $('.children__window').css('margin-bottom', '20px');
        $('.children__window_add').hide();
        sleep(700).then(() => {
            $('.children__add').css('overflow', 'visible');
            sleep(700).then(() => $('.children__add').css('transition-duration', '0s'));
        });
    });
});

function verifyInputs() {
    let valid = true;

    $('.children__add_form input:not(.optionally)').each((i, el) => {
        if (el.value.length === 0) {
            el.classList.add('border-danger');
            valid = false;
        }
    });

    $('input[name=birthday]').each((i, el) => {
        if (!el.value.match(/\d\d\.\d\d\.\d\d\d\d/)) {
            el.classList.add('border-danger');
            valid = false;
        }
    });

    $('input[name=tel]:not(.optionally)').each((i, el) => {
        if (!el.value.match(/\+7\(\d\d\d\)\d\d\d-\d\d-\d\d/)) {
            el.classList.add('border-danger');
            valid = false;
        }
    });

    $('input.time').each((i, el) => {
        if (!el.value.match(/\d\d:\d\d-\d\d:\d\d/)) {
            el.classList.add('border-danger');
            valid = false;
        }
    });

    $('select.weekdays').each((i, el) => {
        if ($(el).find(':selected').index() === 0) {
            el.classList.add('border-danger');
            valid = false;
        }
    });

    $('.children__add_schedule .multyCheckbox__item:first-child').each((i, el) => {
        if ($(el).is(':visible')) {
            $(el).parent().addClass('border-danger');
            valid = false;
        }
    });

    return valid;
}

String.prototype.capitalyze = function() {
    let words = [];
    this.split(' ').forEach(w => {
        words.push(w.charAt(0).toUpperCase() + w.slice(1));
    });
    return words.join(' ');
};