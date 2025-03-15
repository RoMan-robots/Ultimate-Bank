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
            if (response.isAuthenticated) {
                $('#username').text(response.user.name);
                $('#balance').text(`${(response.user.balance).toFixed(2)} ℝ$`); 
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