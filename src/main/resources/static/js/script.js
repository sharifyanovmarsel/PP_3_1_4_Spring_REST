async function fetchUsers() {
    try {
        const response = await fetch('/api/users'); // URL вашего API
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        const users = await response.json();
        const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

        // Очистка таблицы перед добавлением новых данных
        tableBody.innerHTML = '';

        // Добавление пользователей в таблицу
        users.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = user.id; // Замените на правильное поле
            row.insertCell(1).textContent = user.name; // Замените на правильное поле
            row.insertCell(2).textContent = user.email; // Замените на правильное поле
            // Добавьте другие ячейки, если необходимо
        });
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
    }
}

// Вызов функции для получения пользователей при загрузке страницы
window.onload = fetchUsers;
