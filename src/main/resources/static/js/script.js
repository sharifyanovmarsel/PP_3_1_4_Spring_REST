async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        const users = await response.json();
        const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

        tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных

        users.forEach(anyuser => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = anyuser.id;
            row.insertCell(1).textContent = anyuser.name;
            row.insertCell(2).textContent = anyuser.age;
            row.insertCell(3).textContent = anyuser.email;
            row.insertCell(4).textContent = anyuser.rolesAsText;

            // кнопка Edit
            const editCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary edit-btn';
            editButton.setAttribute('data-id', anyuser.id);
            editButton.setAttribute('data-name', anyuser.name);
            editButton.setAttribute('data-age', anyuser.age);
            editButton.setAttribute('data-email', anyuser.email);
            editButton.setAttribute('data-password', anyuser.password);
            editButton.setAttribute('data-roles', anyuser.roles);
            editButton.textContent = 'Edit';
            editCell.appendChild(editButton);

            // Кнопка Delete
            const deleteCell = row.insertCell(6);
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger delete-btn';
            deleteButton.setAttribute('data-id', anyuser.id);
            deleteButton.setAttribute('data-name', anyuser.name);
            deleteButton.setAttribute('data-age', anyuser.age);
            deleteButton.setAttribute('data-email', anyuser.email);
            deleteButton.textContent = 'Delete';
            deleteCell.appendChild(deleteButton);
        });

        // Навешиваем обработчики событий после добавления кнопок
        attachEditButtonListeners();
        attachDeleteButtonListeners(); // Добавляем обработчики для кнопок удаления
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
    }
}

function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            const userName = button.getAttribute('data-name');
            const userAge = button.getAttribute('data-age');
            const userEmail = button.getAttribute('data-email');
            const userPassword = button.getAttribute('data-password');

            document.getElementById('userIdLabel').value = userId;
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;
            document.getElementById('userPassword').value = userPassword;

            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });
}

// Переменная для хранения ID пользователя, которого нужно удалить
let userIdToDelete = null;

function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            userIdToDelete = button.getAttribute('data-id'); // Сохраняем ID пользователя
            const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
            deleteUserModal.show(); // Показываем модальное окно
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Обработчик события для кнопки подтверждения удаления
    document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
        console.log(userIdToDelete); // Проверка значения
        if (userIdToDelete) {
            try {
                const response = await fetch(`/api/users/${userIdToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении пользователя: ' + response.status);
                }
                // Обновляем список пользователей после удаления
                await fetchUsers();
                // Закрываем модальное окно
                const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
                deleteUserModal.hide();
            } catch (error) {
                console.error(error);
            }
        }
    });

});

// Загружаем пользователей при загрузке
window.onload = fetchUsers;

