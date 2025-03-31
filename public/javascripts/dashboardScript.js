$(document).ready(function() {
    const token = localStorage.getItem('token');
    
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
        success: function (response) {
            const user = response.user;
            if (response.isAuthenticated) {
                $('#username').text(user.name);
                $('#balance').text(`${(user.balance).toFixed(2)} ℝ$`); 
                $('#id').text(user.id);
                $('#is_golden').text(user.is_golden ? 'Golden Wallet активовано' : '');
                $.ajax({
                    type: "GET",
                    url: `/store/inventory/${user.id}`,
                    success: function (items) {
                        console.log(items);
                        if (items.length > 0) {
                            $('.inventory-items').empty();
                            items.forEach(item => {
                                $('.inventory-items').append(`<div>${item.name} - ${item.price} ℝ$</div>`);
                            });
                        } else {
                            $('.inventory-items').text('Ваш інвентар порожній.');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error fetching inventory:', error);
                    }
                });
            } else {
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        },
        error: function () {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    });

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    $('#logout-button').on('click', logout);
});