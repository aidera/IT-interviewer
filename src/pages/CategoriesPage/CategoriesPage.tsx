import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Typography } from 'antd';

import classes from './CategoriesPage.module.scss';
import { categoriesStore } from '../../store';
import CategoriesToolbar from '../../components/CategoriesToolbar/CategoriesToolbar';
import CategoriesList from '../../components/CategoriesList/CategoriesList';

const CategoriesPage = () => {
  useEffect(() => {
    categoriesStore.getCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Categories - IT-interviewer</title>
      </Helmet>

      <div className={classes.container}>
        <Typography.Title>Categories</Typography.Title>

        <CategoriesToolbar />

        <CategoriesList />
      </div>
    </>
  );
};

export default CategoriesPage;
