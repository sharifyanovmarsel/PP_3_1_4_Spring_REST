$(document).ready(function() {
    // Обработчик клика по кнопке "Edit"
    $('.edit-btn').on('click', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const age = $(this).data('age');
        const email = $(this).data('email');

        // Заполнение полей формы
        $('#userId').val(id);
        $('#username').val(name);
        $('#userAge').val(age);
        $('#userEmail').val(email);

        // Открытие модального окна
        $('#editUserModal').modal('show');
    });

    // Обработчик клика по кнопке "Save changes"
    $('#saveChangesBtn').on('click', async function() {
        const id = $('#userId').val();
        const name = $('#username').val();
        const age = $('#userAge').val();
        const email = $('#userEmail').val();
        const password = $('#userPassword').val(); // Если вы хотите обновить пароль
        const roles = Array.from(document.querySelector('#roles').selectedOptions).map(option => option.value);

        const data = {
            id: id,
            name: name,
            age: age,
            email: email,
            password: password,
            roles: roles
        };

        // Отправка данных на сервер
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Если обновление прошло успешно, обновите таблицу пользователей
            await getUsers(); // Предполагается, что у вас есть функция для обновления списка пользователей
            $('#editUserModal').modal('hide'); // Закрытие модального окна
        } else {
            // Если произошла ошибка, отобразите сообщение об ошибке
            const body = await response.json();
            const alert = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${body.info}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
            $('#editUserModal .modal-body').prepend(alert);
        }
    });
});

// Функция для получения пользователей (пример)
async function getUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    // Обновите таблицу пользователей здесь
    // Например, перерисуйте таблицу с новыми данными
}

