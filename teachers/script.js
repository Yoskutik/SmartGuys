$(window).ready(() => {
    $(document).on('click', '.remove', function () {
        let el = $(this).parent();
        if (el.find('input').val().trim().length !== 0 || !!el.data('id')) {
            if (confirm(`Удалить учителя ${el.find('input').val().trim()}?`)) {
                $.ajax({
                    url: '/api/removeTeacher',
                    type: 'post',
                    data: {
                        id: el.data('id'),
                        fio: el.find('input').val().trim(),
                    },
                    success: () => {
                        toast(`Учитель ${el.find('input').val().trim()} был удален`);
                        el.remove();
                    },
                });
            }
        } else {
            el.remove();
        }
    });

    $(document).on('input', '.save', function () {
        this.classList.remove('border-danger');
    });

    $(document).on('click', '.schedule', function() {
        open(`${location.origin}/teachers/schedule/?id=${$(this).parent().data('id')}`)
    });

    $(document).on('click', '.update', function () {
        $(this).toggleClass('update save').parent().find('input').removeAttr('disabled');
    });

    $(document).on('click', '.save', function () {
        let el = $(this).parent();
        if (!el.find('input').val()) {
            el.find('.save').addClass('border-danger');
            return;
        }
        if (confirm(`Сохранить учителя ${el.find('input').val().trim()}?`)) {
            if (!el.data('id')) {
                $.ajax({
                    url: '/api/addTeacher',
                    type: 'post',
                    data: {
                        fio: el.find('input').val().capitalyzeAll(),
                    },
                    success: data => {
                        el.attr('data-id', data.id).find('input').attr('disabled', true);
                        el.find('.save').toggleClass('save update');
                        toast('Данные были обновлены');
                    },
                });
            } else {
                $.ajax({
                    url: '/api/updateTeacher',
                    type: 'post',
                    data: {
                        id: el.data('id'),
                        fio: el.find('input').val(),
                    },
                    success: () => {
                        el.find('input').attr('disabled', true);
                        el.find('.save').toggleClass('save update');
                        toast('Данные были обновлены');
                    },
                });
            }
        }
    });

    $('.add').on('click', () => {
        $('.teachers__list').append(`
            <li>
                <input type="text">
                <span class="remove"></span>
                <span class="save"></span>
            </li>
        `);
    });
});