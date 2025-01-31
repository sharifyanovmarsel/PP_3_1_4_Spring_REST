async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        const users = await response.json();
        const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

        tableBody.innerHTML = '';

        users.forEach(anyuser => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = anyuser.id;
            row.insertCell(1).textContent = anyuser.name;
            row.insertCell(2).textContent = anyuser.age;
            row.insertCell(3).textContent = anyuser.email;
            row.insertCell(4).textContent = anyuser.rolesAsText;

            // Добавляем кнопку Edit
            const editCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary edit-btn';
            editButton.setAttribute('data-id', anyuser.id);
            editButton.setAttribute('data-name', anyuser.name);
            editButton.setAttribute('data-age', anyuser.age);
            editButton.setAttribute('data-email', anyuser.email);
            editButton.textContent = 'Edit';
            editCell.appendChild(editButton);
        });

        // Навешиваем обработчики событий после добавления кнопок
        attachEditButtonListeners();
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

            document.getElementById('userId').value = userId;
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;

            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });
}

window.onload = fetchUsers;

document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            const userName = button.getAttribute('data-name');
            const userAge = button.getAttribute('data-age');
            const userEmail = button.getAttribute('data-email');

            // Заполняем поля модального окна
            document.getElementById('userId').value = userId;
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;

            // Показываем модальное окно
            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });
});


