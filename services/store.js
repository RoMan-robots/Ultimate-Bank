var { getAllStoreItems, buyStoreItem, getStoreItemById, hasUserItem, getUserInventory } = require('../model/query/store');

const allStoreItems = async (req, res) => {
    const items = await getAllStoreItems();
    res.send(items)
}

const inventory = async (req, res) => {
    const userId = req.params.userId;
    const inventory = await getUserInventory(userId);
    res.send(inventory)
}

const buy = async (req, res) => {
    const { itemId, user } = req.body;
    const userId = user.id;

    const item = (await getStoreItemById(itemId))[0];

    if (!item) {
        return res.status(404).json({ error: 'Товар не знайдено' });
    }

    const ownsItem = await hasUserItem(userId, itemId);
    if (ownsItem) {
        return res.status(400).json({ error: 'Ви вже володієте цим товаром' });
    }

    if (item.is_golden && !user.is_golden) {
        return res.status(400).json({ error: 'Ви повинні мати Golden Wallet для покупки цього товару' });
    }

    if ((user.balance - item.price) < 0) {
        return res.status(400).json({ error: 'Недостатньо коштів для покупки цього товару' });
    }

    await buyStoreItem(userId, itemId);
    res.status(200).json({ success: true });
}

module.exports = { allStoreItems, inventory, buy }