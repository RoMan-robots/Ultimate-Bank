$(document).ready(function () {
    const token = localStorage.getItem('token');
    let items;

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

    $('.section-header').click(function () {
        const sectionContent = $(this).next('.section-content');
        const toggleButton = $(this).find('.toggle-section');

        sectionContent.slideToggle(300);

        if (toggleButton.text() === '▼') {
            toggleButton.text('▲');
        } else {
            toggleButton.text('▼');
        }
    });

    const storeItems = $('.store-items');

    function renderStoreItems(items) {
        storeItems.empty();
        if (!items.length) {
            storeItems.append('<p>Пустий магазин</p>');
            return;
        }

        const rarityTranslations = {
            'common': 'Звичайна',
            'uncommon': 'Незвичайна',
            'rare': 'Рідкісна',
            'epic': 'Епічна',
            'legendary': 'Легендарна',
        };

        items.forEach(item => {
            const itemCard = `
                <div class="store-item" data-id="${item.id}">
                    <img src="${item.image_url || '/images/item.jpg'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="item-details">
                        <span class="price">${item.price} ℝ$</span> <br>
                        <span class="category">Категорія: ${item.category}</span> <br>
                        <span class="rarity">Рідкість: ${rarityTranslations[item.rarity] || item.rarity}</span> <br>
                        ${item.is_golden ? '<span class="exclusive">Ексклюзивно для Golden Wallet</span>' : ''}
                    </div>
                    <button class="buy-button">Придбати</button>
                </div>
            `;
            storeItems.append(itemCard);
        });
    }

    $(document).on('click', '.buy-button', function (e) { 
        const itemId = $(this).closest('.store-item').data('id');
        buyItem(itemId);
    });

    function sortItems() {
        const sortType = $('#sort-select').val();
        let sortedItems = [...items];

        const sortMethods = {
            'price-low-to-high': (a, b) => a.price - b.price,
            'price-high-to-low': (a, b) => b.price - a.price,
            'rarity-high-to-low': (a, b) =>
                ['legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(a.rarity) -
                ['legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(b.rarity),
            'rarity-low-to-high': (a, b) =>
                ['common', 'uncommon', 'rare', 'epic', 'legendary'].indexOf(a.rarity) -
                ['common', 'uncommon', 'rare', 'epic', 'legendary'].indexOf(b.rarity),
            'category': (a, b) => a.category.localeCompare(b.category),
            'alphabet': (a, b) => a.name.localeCompare(b.name)
        };

        if (sortMethods[sortType]) {
            sortedItems.sort(sortMethods[sortType]);
        }

        renderStoreItems(sortedItems);
    }

    function filterItems() {
        let minPrice = parseInt($('#min-price').val()) || 0;
        let maxPrice = parseInt($('#max-price').val()) || Infinity;

        let rarities = [];
        let categories = [];

        let exclusive = $('#exclusive').is(':checked');

        if ($('#common').is(':checked')) rarities.push('common');
        if ($('#uncommon').is(':checked')) rarities.push('uncommon');
        if ($('#rare').is(':checked')) rarities.push('rare');
        if ($('#epic').is(':checked')) rarities.push('epic');
        if ($('#legendary').is(':checked')) rarities.push('legendary');

        if ($('clothing').is(':checked')) categories.push('Одяг');
        if ($('electronics').is(':checked')) categories.push('Електроніка');
        if ($('accessories').is(':checked')) categories.push('Аксесуари');
        if ($('school').is(':checked')) categories.push('Канцелярія');
        if ($('decor').is(':checked')) categories.push('Декор');
        if ($('transport').is(':checked')) categories.push('Транспорт');


        let filteredItems = items.filter(item => {
            const priceInRange = item.price >= minPrice && item.price <= maxPrice;
            const rarityMatch = rarities.length === 0 || rarities.includes(item.rarity);
            const categoryMatch = categories.length === 0 || categories.includes(item.category);
            const exclusiveMatch = !exclusive || item.is_golden;
            console.log(item);

            return priceInRange && rarityMatch && categoryMatch && exclusiveMatch;
        });

        renderStoreItems(filteredItems);
    }

    $('#filter input').on('change', filterItems);
    $('#sort-select').on('change', sortItems);
    $.ajax({
        url: '/store/all',
        method: 'GET',
        success: function (response) {
            items = response;
            renderStoreItems(response);
        },
        error: function (xhr, status, error) {
            console.error('Помилка завантаження товарів:', error);
            $storeItems.html('<p>Не вдалося завантажити товари. Спробуйте пізніше.</p>');
        }
    });

    function buyItem(itemId) {
        $.ajax({
            type: "GET",
            url: "/checkAuth",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            dataType: "json", 
            success: function (userResponse) {
                const user = userResponse.user;
                console.log('Sending data:', { itemId, user })
                $.ajax({
                    url: '/store/buy',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ itemId, user }),
                    success: function (storeResponse) {
                        console.log('Товар покупки:', storeResponse, itemId, userResponse.user.id);
                    },
                    error: function (xhr, status, error) {
                        showNotification('error', xhr.responseJSON.error);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error('Помилка при перевірці автендифікації:', error);
            }
        });
    }
});