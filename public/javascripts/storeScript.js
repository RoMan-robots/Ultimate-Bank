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
                        <span class="rarity">Рідкість: ${rarityTranslations[item.rarity] || item.rarity}</span>
                    </div>
                    <button class="buy-button" data-id="${item.id}">Придбати</button>
                </div>
            `;
            storeItems.append(itemCard);
        });
    }

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
});