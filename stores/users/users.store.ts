import { inject } from 'inversify';
import { action, observable } from 'mobx';
import { Api } from '../../core/api';
import { TApiFactory } from '../../di/bindings/bindApiService';
import { makeStore } from '../../core/provider';
import { UsersDto } from './dto';
import { User } from './user';

@makeStore(UsersStore)
export class UsersStore {
  @observable public users: User[] = [];
  @observable public totalCount: number = 0;
  @observable public query: string = '';
  private getUsers: Api<UsersDto>;

  constructor(@inject(TApiFactory) apiFactory: TApiFactory) {
    this.getUsers = apiFactory('defaultApi', 'GET', '/search/users', UsersDto);
  }

  @action public async searchUsers() {
    const { data: { items, totalCount } } = await this.getUsers.run({
      params: { q: this.query, order: 'desc' },
    });
    this.users = items.map(User.create);
    this.totalCount = totalCount;
  }

  @action public setQuery(query: string) {
    this.query = query;
  }
}
