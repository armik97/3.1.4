const URLTableUsers = '/api/admin/users';
const URLAdminInfo = '/api/admin/info';
const tableBody = document.getElementById("users-table-body");
const headerEmail = document.getElementById('userDataEmail');
const headerRoles = document.getElementById('userDataRoles');
const authorizedUserData = document.getElementById('authorizedUserData');

// Загрузка данных при открытии страницы
window.onload = function () {
    getAllUsers();
    getAdmin();
};

// Обновление данных
function refreshData() {
    getAllUsers();
    getAdmin();
}

// Получение всех пользователей
function getAllUsers() {
    fetch(URLTableUsers)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке пользователей');
            }
            return response.json();
        })
        .then(users => {
            let rowsHTML = "";
            tableBody.innerHTML = "";
            users.forEach(user => {
                const roles = user.roles.map(role => role.role.replace("ROLE_", "")).join(" ");
                rowsHTML += `
                    <tr class="alert-secondary">
                        <td class="py-2 pl-2">${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td>
                        <td class="py-2">
                            <button
                                class="btn btn-info open-edit-modal"
                                data-toggle="modal"
                                data-target="#editUserModal"
                                data-id="${user.id}"
                                data-name="${user.name}"
                                data-lastname="${user.lastname}"
                                data-age="${user.age}"
                                data-email="${user.email}"
                                data-roles="${roles}">Edit</button>
                        </td>
                        <td class="py-2">
                            <button
                                class="btn btn-danger open-delete-modal"
                                data-toggle="modal"
                                data-target="#deleteUserModal"
                                data-id="${user.id}">Delete</button>
                        </td>
                    </tr>
                `;
            });
            tableBody.innerHTML = rowsHTML;
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("Не удалось загрузить пользователей. Проверьте консоль для подробностей.");
        });
}

// Получение информации об админе
function getAdmin() {
    fetch(URLAdminInfo)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке информации об админе');
            }
            return response.json();
        })
        .then(admin => {
            const roles = admin.roles.map(role => role.role.replace("ROLE_", "")).join(" ");
            headerEmail.textContent = admin.email;
            headerRoles.textContent = roles;

            const rowUserDataHtml = `
                <tr class="border-top alert-secondary">
                    <td class="py-2 pl-2">${admin.id}</td>
                    <td>${admin.name}</td>
                    <td>${admin.lastname}</td>
                    <td>${admin.age}</td>
                    <td>${admin.email}</td>
                    <td class="py-2">${roles}</td>
                </tr>
            `;
            authorizedUserData.innerHTML = rowUserDataHtml;
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("Не удалось загрузить информацию об админе. Проверьте консоль для подробностей.");
        });
}

// Обработчик для добавления нового пользователя
document.getElementById('addNewUser').addEventListener('submit', (event) => {
    event.preventDefault();

    const user = {
        name: document.getElementById('nameToAdd').value,
        lastname: document.getElementById('lastnameToAdd').value,
        age: document.getElementById('ageToAdd').value,
        email: document.getElementById('emailToAdd').value,
        password: document.getElementById('passwordToAdd').value,
        roles: Array.from(document.querySelectorAll('input[name="roleToAdd"]:checked'))
            .map(checkbox => checkbox.value)
    };

    fetch('/api/admin/user/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при добавлении пользователя');
            } else {
                refreshData();
                alert('Пользователь успешно добавлен!');
                document.getElementById('addNewUser').reset();
                document.getElementById('showUsersListBtn').click();
                document.getElementById('usersList');
                document.getElementById('addUserForm');


                usersList.style.display = 'block';
                addUserForm.style.display = 'none';
            }

        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось добавить пользователя. Проверьте консоль для подробностей.');
        });
});

// Обработчик для редактирования пользователя
document.getElementById('editUserForm')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const user = {
        id: document.getElementById('editUserId').value,
        name: document.getElementById('editName').value,
        lastname: document.getElementById('editLastname').value,
        age: document.getElementById('editAge').value,
        email: document.getElementById('editEmail').value,
        password: document.getElementById('editPassword').value,
        roles: Array.from(document.querySelectorAll('input[name="roleToEdit"]:checked'))
            .map(checkbox => checkbox.value)
    };

    fetch('/api/admin/user/edit', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при редактировании пользователя');
            } else {
                refreshData();
                alert('Пользователь успешно отредактирован!');
                document.getElementById('closeEdit').click();
            }

        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось отредактировать пользователя. Проверьте консоль для подробностей.');
        });
});

// Обработчик для удаления пользователя
document.getElementById('deleteUserForm')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = document.getElementById('deleteUserId').value;

    fetch(`/api/admin/user/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при удалении пользователя');
            } else {
                refreshData();
                alert('Пользователь успешно удален!');
                document.getElementById('closeDelete').click();
            }
            
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось удалить пользователя. Проверьте консоль для подробностей.');
        });
});

// Обработчики для модальных окон
$(document).on('click', '.open-edit-modal', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const lastname = $(this).data('lastname');
    const age = $(this).data('age');
    const email = $(this).data('email');

    $('#editUserId').val(id);
    $('#editName').val(name);
    $('#editLastname').val(lastname);
    $('#editAge').val(age);
    $('#editEmail').val(email);
});

$(document).on('click', '.open-delete-modal', function () {
    const id = $(this).data('id');
    $('#deleteUserId').val(id);
});