$(document).ready(function () {
    const token = localStorage.getItem('token');
    let user;

    if (!token) {
        window.location.href = '/';
        return;
    }

    $.ajax({
        type: "GET",
        url: "/checkAuth",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        dataType: "json",
        success: function (response) {
            user = response.user;
            if (user.is_golden) {
                $('#title').text('Дякую за покупку Golden Wallet!');
                $('#description').text('Ваші можливості: ');
                $('#buy-button').hide();
            }
        },
        error: function (xhr, status, error) {
            console.error('Помилка при перевірці автендифікації:', error);
            showNotification("Помилка при перевірці автендифікації", 'error');
        }
    });

    $('#buy-button').click(function () {
        if (user.is_golden) {
            showNotification("Ви вже маєте Golden Wallet", 'error');
            return;
        } else if (user.balance < 400) {
            showNotification("Недостатньо грошей для покупки Golden Wallet", 'error');
            return;
        } else {
            $.ajax({
                url: '/goldenWallet/',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ user }),
                success: function (response) {
                    showNotification("Вітаємо з покупкою Golden Wallet!", 'success');
                    setTimeout(function () {
                        window.location.href = '/dashboard';
                    }, 1500);
                },
                error: function (xhr, status, error) {
                    showNotification(xhr.responseJSON.error, 'error');
                }
            });
        }
    });
});