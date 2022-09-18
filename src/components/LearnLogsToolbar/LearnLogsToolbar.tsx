import React, { useState } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select } from 'antd';
import { useMediaQuery } from '@react-hook/media-query';

import classes from './LearnLogsToolbar.module.scss';
import { learnLogsStore } from '../../store';

const typeOptions: React.ReactNode[] = [
  <Select.Option key={''} value={''}>
    {'--- None ---'}
  </Select.Option>,
  <Select.Option key={'ITERATION'} value={'ITERATION'}>
    {'Iteration'}
  </Select.Option>,
  <Select.Option key={'FINISHING'} value={'FINISHING'}>
    {'Finishing'}
  </Select.Option>,
];

const LearnLogsToolbar = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);

  const isMobileView = useMediaQuery('(max-width: 700px)');

  const onDateSelected = (data: any) => {
    learnLogsStore.setFilters(
      'dateFrom',
      data && data[0] ? data[0].toISOString() : null,
    );
    learnLogsStore.setFilters(
      'dateTo',
      data && data[1] ? data[1].toISOString() : null,
    );
  };

  const onClearFiltersClick = () => {
    learnLogsStore.clearFilters();
  };

  return (
    <>
      <div className={classes.toolbar}>
        {isMobileView && (
          <div className={classes.mobileFiltersTrigger}>
            <Button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              type='link'
              icon={isMobileFiltersOpen ? <UpOutlined /> : <DownOutlined />}
            >
              Filters
            </Button>
          </div>
        )}

        <div
          className={
            classes.filters +
            ' ' +
            (!isMobileFiltersOpen ? classes.filtersClosed : '')
          }
        >
          {!isMobileView && <span>Filters: </span>}

          <Select
            allowClear
            mode='multiple'
            placeholder='Type'
            maxTagCount='responsive'
            value={learnLogsStore.filters.type}
            onChange={(e) => {
              learnLogsStore.setFilters('type', e);
            }}
          >
            {typeOptions}
          </Select>

          <DatePicker.RangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }}
            format='YYYY-MM-DD HH:mm:ss'
            onChange={(e) => {
              onDateSelected(e);
            }}
            value={[
              learnLogsStore.filters.dateFrom
                ? moment(learnLogsStore.filters.dateFrom)
                : null,
              learnLogsStore.filters.dateTo
                ? moment(learnLogsStore.filters.dateTo)
                : null,
            ]}
          />

          {!isMobileView ? (
            <Button
              onClick={onClearFiltersClick}
              title='Clear filters'
              type='text'
              icon={<CloseOutlined />}
            ></Button>
          ) : (
            <Button onClick={onClearFiltersClick}>Clear filters</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default observer(LearnLogsToolbar);
