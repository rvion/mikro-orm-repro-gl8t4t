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
    debug: ['query', 'query-params'],
  });
  await orm.schema.refreshDatabase();
  await orm.em.nativeInsert(User, { id: 1, name: 'user1' });
  await orm.em.nativeInsert(Item, { id: 1, user: 1 });
  await orm.em.nativeInsert(Item, { id: 2, user: 1 });
});

afterAll(async () => {
  await orm.close();
});

test('test1', async () => {
  expect('foo').toBe('foo');
  const em =  orm.em.fork()
  const ItemRepo = em.getRepository(Item)
  const UserRepo = em.getRepository(User)
  expect(await ItemRepo.count()).toBe(2)
  expect(await UserRepo.count()).toBe(1)
  console.log('🟢 ----------------------- ')

  // NO PERSIST
  // NO FLUSH
  ItemRepo.create({user: 1, id: 3 })

  // 🔴 | the `find` triggers an insert:
  // 🔴 | insert into `item` (`id`, `user_id`) values (3, 1) returning `id`
  await UserRepo.find(1,{populate: ['items']})



  // console.log(orm);
});
