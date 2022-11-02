import { SqliteDriver } from '@mikro-orm/sqlite';
import * as M from '@mikro-orm/core';

@M.Entity()
export class User {
  @M.PrimaryKey() id!: number;
  @M.Property() name!: string;
  @M.OneToMany(() => Item, (item) => item.user) items = new M.Collection<Item>(
    this
  );
}

@M.Entity()
export class Item {
  @M.PrimaryKey() id!: number;
  @M.ManyToOne() user!: User;
}

let orm: M.MikroORM<SqliteDriver>;

beforeAll(async () => {
  orm = await M.MikroORM.init({
    type: 'sqlite',
    dbName: ':memory:',
    entities: [User, Item],
  });
  await orm.schema.refreshDatabase();
  await orm.em.nativeInsert(User, { id: 1, name: 'user1' });
  await orm.em.nativeInsert(Item, { id: 1 });
  await orm.em.nativeInsert(Item, { id: 2 });
});

afterAll(async () => {
  await orm.close();
});

test('test1', async () => {
  expect('foo').toBe('foo');
  // console.log(orm);
});
