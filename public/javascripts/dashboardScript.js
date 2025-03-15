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
                $.ajax({
                    type: "GET",
                    url: "/store/inventory",
                    data: {
                        userId: user.id
                    },
                    success: function (items) {
                        console.log(items);
                        if (items.length > 0) {
                            $('.inventory-items').text(items);
                        }
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
});