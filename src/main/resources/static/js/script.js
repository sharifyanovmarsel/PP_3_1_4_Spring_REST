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

            // кнопка Edit
            const editCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary edit-btn';
            editButton.setAttribute('data-id', anyuser.id);
            editButton.setAttribute('data-name', anyuser.name);
            editButton.setAttribute('data-age', anyuser.age);
            editButton.setAttribute('data-email', anyuser.email);
            editButton.setAttribute('data-password', anyuser.password);
            editButton.setAttribute('data-roles', JSON.stringify(anyuser.roles));
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

        attachEditButtonListeners();
        attachDeleteButtonListeners();
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
            const userRoles = JSON.parse(button.getAttribute('data-roles'));

            document.getElementById('userId').value = userId;
            document.getElementById('userIdLabel').value = userId;
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;

            const rolesContainer = document.getElementById('rolesContainer');
            rolesContainer.innerHTML = '';

            roles.forEach(role => {
                const checkbox = document.createElement('div');
                checkbox.classList.add('form-check');
                checkbox.innerHTML = `
                    <input class="form-check-input" type="checkbox" id="role${role.id}" value="${role.name}" ${userRoles.includes(role.name) ? 'checked' : ''}>
                    <label class="form-check-label" for="role${role.id}">
                        ${role.name}
                    </label>
                `;
                rolesContainer.appendChild(checkbox);
            });

            // Открываем модальное окно
            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });
}

const roles = [
    { id: 1, name: 'ROLE_ADMIN' },
    { id: 2, name: 'ROLE_USER' },

];

let userIdToDelete = null;

function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            userIdToDelete = button.getAttribute('data-id'); // Сохраняем ID пользователя
            const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
            deleteUserModal.show();
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
        console.log(userIdToDelete);
        if (userIdToDelete) {
            try {
                const response = await fetch(`/api/users/${userIdToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении пользователя: ' + response.status);
                }
                await fetchUsers();
                const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
                deleteUserModal.hide();
            } catch (error) {
                console.error(error);
            }
        }
    });

});

window.onload = fetchUsers;

document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            const userName = this.getAttribute('data-name');
            const userAge = this.getAttribute('data-age');
            const userEmail = this.getAttribute('data-email');

            document.getElementById('userId').value = userId;
            document.getElementById('userIdLabel').value = userId;
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;

            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            const userName = this.getAttribute('data-name');
            const userAge = this.getAttribute('data-age');
            const userEmail = this.getAttribute('data-email');
            const userRoles = this.getAttribute('data-roles'); // Предположим, что у вас есть атрибут data-roles

            // Заполняем поля модального окна
            document.getElementById('userId').value = userId;
            document.getElementById('userIdLabel').value = userId; // Для отображения ID
            document.getElementById('userName').value = userName;
            document.getElementById('userAge').value = userAge;
            document.getElementById('userEmail').value = userEmail;

            const rolesContainer = document.getElementById('rolesContainer');
            rolesContainer.innerHTML = '';

            // Создаем чекбоксы для ролей
            roles.forEach(role => {
                const checkbox = document.createElement('div');
                checkbox.classList.add('form-check');
                checkbox.innerHTML = `
                <input class="form-check-input" type="checkbox" id="role${role.id}" value="${role.name}" ${userRoles.includes(role.name) ? 'checked' : ''}>
                <label class="form-check-label" for="role${role.id}">
                    ${role.name}
                </label>
            `;
                rolesContainer.appendChild(checkbox);
            });

            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });


    document.getElementById('saveChangesBtn').addEventListener('click', function () {
        const userId = parseInt(document.getElementById('userId').value, 10);
        const userName = document.getElementById('userName').value;
        const userAge = document.getElementById('userAge').value;
        const userEmail = document.getElementById('userEmail').value;
        const userPassword = document.getElementById('userPassword').value;


        const selectedRoles = [];
        const roleCheckboxes = document.querySelectorAll('#rolesContainer input[type="checkbox"]');
        roleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const roleId = parseInt(checkbox.id.replace('role', ''));
                selectedRoles.push({ id: roleId });
            }
        });

        const user = {
            id: userId,
            name: userName,
            age: userAge,
            email: userEmail,
            password: userPassword,
            roles: selectedRoles
        };

        console.log('User object to update:', user);

        fetch(`/api/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                    editUserModal.hide();
                    location.reload();
                } else {
                    alert('Ошибка при обновлении пользователя');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });

});
