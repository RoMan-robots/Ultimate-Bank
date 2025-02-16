$(document).ready(function () {
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
                $('#balance').text(`${response.user.balance} ℝ$`); 
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

    $('.section-header').click(function() {
        const $sectionContent = $(this).next('.section-content');
        const $toggleButton = $(this).find('.toggle-section');
        
        $sectionContent.slideToggle(300);
        
        if ($toggleButton.text() === '▼') {
            $toggleButton.text('▲');
        } else {
            $toggleButton.text('▼');
        }
    });

    const $storeItems = $('.store-items');

    function renderStoreItems(items) {
        $storeItems.empty();
        
        const rarityTranslations = {
            'common': 'звичайна',
            'uncommon': 'незвичайна',
            'rare': 'рідкісна',
            'epic': 'епічна',
            'legendary': 'легендарна',
        };
        
        items.forEach(item => {
            const itemCard = `
                <div class="store-item" data-id="${item.id}">
                    <img src="${item.image_url || '/images/item.jpg'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="item-details">
                        <span class="price">${item.price} ℝ$</span>
                         <span class="rarity">Рідкість: ${rarityTranslations[item.rarity] || item.rarity}</span>
                    </div>
                    <button class="buy-button" data-id="${item.id}">Придбати</button>
                </div>
            `;
            $storeItems.append(itemCard);
        });
    }

    $.ajax({
        url: '/store/all',
        method: 'GET',
        success: function(items) {
            renderStoreItems(items);
        },
        error: function(xhr, status, error) {
            console.error('Помилка завантаження товарів:', error);
            $storeItems.html('<p>Не вдалося завантажити товари. Спробуйте пізніше.</p>');
        }
    });
});