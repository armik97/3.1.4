$(document).ready(function() {

    $(document).on('click', '.open-edit-modal', function() {
        let id = $(this).data('id')
        let name = $(this).data('name')
        let lastname = $(this).data('lastname')
        let age = $(this).data('age')
        let email = $(this).data('email')

        $('#editUserId').val(id);
        $('#editName').val(name);
        $('#editLastname').val(lastname);
        $('#editAge').val(age);
        $('#editEmail').val(email);

    });

    // Делегирование события click для кнопок удаления
    $(document).on('click', '.open-delete-modal', function() {
        let id = $(this).data('id')
        let name = $(this).data('name')
        let lastname = $(this).data('lastname')
        let age = $(this).data('age')
        let email = $(this).data('email')
        let roles = $(this).data('roles')

        $('#deleteUserId').val(id);
        $('#deleteName').val(name);
        $('#deleteLastname').val(lastname);
        $('#deleteAge').val(age);
        $('#deleteEmail').val(email);
        $('#deleteRoles').val(roles);
    });

});
