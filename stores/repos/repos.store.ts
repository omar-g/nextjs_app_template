import { inject } from 'inversify';
import { observable } from 'mobx';
import { Api, TApiFactory } from '../api';
import { makeStore } from '../provider/MakeStore';
import { SearchResults } from './dto';
import { Repo } from './Repo';

@makeStore(ReposStore)
export class ReposStore {
  @observable public repos: Repo[] = [];
  @observable public totalCount: number = 0;
  private getRepos: Api<SearchResults>;

  constructor(@inject(Api) apiFactory: TApiFactory ) {
    this.getRepos = apiFactory('defaultApi', 'GET', 'search/repositories', SearchResults);
  }

  public async searchRepos(query: string) {
    const { data: { items, totalCount } } = await this.getRepos.run({
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
        page: 1
      },
    });

    this.repos = items.map(Repo.create);
    this.totalCount = totalCount;
  }
}
