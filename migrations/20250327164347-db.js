'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return Promise.all([
    db.dropTable('purchases', { ifExists: true }),
    db.dropTable('store_items', { ifExists: true }),
    db.dropTable('users', { ifExists: true }),
    db.createTable('users', {
      id: { type: 'serial', primaryKey: true },
      login: { type: 'varchar', unique: true },
      email: { type: 'varchar', unique: true },
      password: { type: 'varchar' },
      balance: { type: 'float' },
      is_golden: { type: 'boolean', defaultValue: false }
    }),
    db.createTable('store_items', {
      id: { type: 'serial', primaryKey: true },
      name: { type: 'varchar', unique: true },
      description: { type: 'varchar' },
      price: { type: 'float' },
      image_url: { type: 'varchar' },
      category: { type: 'varchar' },
      rarity: { type: 'varchar' },
    }),
    db.createTable('purchases', {
      id: { type: 'serial', primaryKey: true },
      customer: { type: 'int', notNull: true, foreignKey: { name: 'fk_customer', table: 'users', mapping: 'id' } },
      bought_item: { type: 'int', notNull: true, foreignKey: { name: 'fk_bought_item', table: 'store_items', mapping: 'id' } },
      date: { type: 'date' }
    })
  ]);
};

exports.down = function(db) {
  return Promise.all([
    db.dropTable('purchases', { ifExists: true }),
    db.dropTable('store_items', { ifExists: true }),
    db.dropTable('users', { ifExists: true })
  ]);
};

exports._meta = {
  "version": 1
};