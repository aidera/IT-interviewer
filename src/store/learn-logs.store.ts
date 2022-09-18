import { action, computed, makeObservable, observable } from 'mobx';
import moment from 'moment';

import { GetLearnLog } from '../models/log.model';
import LogsAPIInstance from '../api/logs.api';

export interface ILearnLogsStoreFilters {
  type: string[];
  dateFrom: string | null;
  dateTo: string | null;
}

class LearnLogsStore {
  @observable learnLogs: GetLearnLog[] = [];
  @observable isFetching: boolean = false;
  @observable isUpdating: boolean = false;
  @observable filters: ILearnLogsStoreFilters = {
    type: [],
    dateFrom: null,
    dateTo: null,
  };

  @computed get filteredLearnLogs(): GetLearnLog[] {
    const filtered = this.learnLogs.filter((log) => {
      const typeFits =
        this.filters.type.includes(log.type) || this.filters.type.length === 0;
      const dateFromFits = this.filters.dateFrom
        ? moment(log.date).isAfter(this.filters.dateFrom)
        : true;
      const dateToFits = this.filters.dateTo
        ? moment(log.date).isBefore(this.filters.dateTo)
        : true;

      return typeFits && dateFromFits && dateToFits;
    });

    return filtered;
  }

  @action setLearnLogs(logs: GetLearnLog[]): void {
    this.learnLogs = logs;
  }

  @action setIsFetching(status: boolean): void {
    this.isFetching = status;
  }

  @action setIsUpdating(status: boolean): void {
    this.isUpdating = status;
  }

  @action getLearnLogs(useUpdatingInsteadOfetching: boolean = false): void {
    if (useUpdatingInsteadOfetching) {
      this.setIsUpdating(true);
    } else {
      this.setIsFetching(true);
    }
    LogsAPIInstance.getLearnLogs()
      .then((res) => {
        if (res.data) {
          this.setLearnLogs(res.data);
        }
      })
      .finally(() => {
        if (useUpdatingInsteadOfetching) {
          this.setIsUpdating(false);
        } else {
          this.setIsFetching(false);
        }
      });
  }

  @action setFilters(type: keyof ILearnLogsStoreFilters, value: any) {
    this.filters[type] = value;
  }

  @action clearFilters() {
    this.filters = {
      type: [],
      dateFrom: null,
      dateTo: null,
    };
  }

  constructor() {
    makeObservable(this);
  }
}

export default LearnLogsStore;
