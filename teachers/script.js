$(window).ready(() => {
    $(document).on('click', '.remove', function () {
        let el = $(this).parent();
        if (el.find('style.scss').val().trim().length !== 0 || !!el.data('id')) {
            if (confirm(`Удалить учителя ${el.find('style.scss').val().trim()}?`)) {
                $.ajax({
                    url: '/api/removeTeacher',
                    type: 'post',
                    data: {
                        id: el.data('id'),
                    },
                    success: () => {
                        toast(`Учитель ${el.find('style.scss').val().trim()} был удален`);
                        el.remove();
                    },
                });
            }
        } else {
            el.remove();
        }
    });

    $(document).on('style.scss', '.save', function () {
        this.classList.remove('border-danger');
    });

    $(document).on('click', '.update', function () {
        $(this).toggleClass('update save').parent().find('input').removeAttr('disabled');
    });

    $(document).on('click', '.save', function () {
        let el = $(this).parent();
        if (!el.find('style.scss').val()) {
            el.find('.save').addClass('border-danger');
            return;
        }
        if (confirm(`Сохранить учителя ${el.find('style.scss').val().trim()}?`)) {
            if (!el.data('id')) {
                $.ajax({
                    url: '/api/addTeacher',
                    type: 'post',
                    data: {
                        fio: el.find('style.scss').val(),
                    },
                    success: data => {
                        el.attr('data-id', data.id).find('style.scss').attr('disabled', true);
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
                        fio: el.find('style.scss').val(),
                    },
                    success: () => {
                        el.find('style.scss').attr('disabled', true);
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