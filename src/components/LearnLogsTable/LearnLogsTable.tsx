import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import Column from 'antd/lib/table/Column';

import classes from './LearnLogsTable.module.scss';
import { learnLogsStore } from '../../store';
import FullWidthLoader from '../FullWidthLoader/FullWidthLoader';
import { GetLearnLog } from '../../models/log.model';

interface DataType extends GetLearnLog {
  key: React.Key;
}

const LearnLogsTable = () => {
  const [learnLogs, setLearnLogs] = useState<DataType[]>([]);

  useEffect(() => {
    learnLogsStore.getLearnLogs();
  }, []);

  useEffect(() => {
    const tableLearnLogs = learnLogsStore.filteredLearnLogs.map((log) => {
      return {
        key: log.id,
        type:
          log.type.charAt(0).toUpperCase() + log.type.slice(1).toLowerCase(),
        date: new Date(log.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      } as DataType;
    });
    setLearnLogs(tableLearnLogs);
  }, [learnLogsStore.filteredLearnLogs]);

  return (
    <>
      {learnLogsStore.isFetching && <FullWidthLoader />}

      {!learnLogsStore.isFetching && (
        <Table
          dataSource={learnLogs}
          className={
            classes.table +
            ' ' +
            (learnLogsStore.isUpdating ? classes.tableIsUpdating : '')
          }
        >
          <Column title='Type' dataIndex='type' key='type' />

          <Column title='Date' dataIndex='date' key='date' />
        </Table>
      )}
    </>
  );
};

export default observer(LearnLogsTable);
