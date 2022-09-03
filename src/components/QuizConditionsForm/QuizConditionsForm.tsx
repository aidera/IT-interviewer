import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';

import classes from './QuizConditionsForm.module.scss';
import { categoriesStore, quizStore } from '../../store';
import { formUtils } from '../../utils/form.utils';
import { QuizQuestionCategory } from '../../models/category.model';
import { QuizCreationData } from '../../models/quiz.model';

type FormInput = QuizCreationData;

const defaultValues = {
  questionsCount: 10,
  categories: [] as number[],
};

const QuizConditionsForm = () => {
  const form = useForm<FormInput>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const callback = (categories: QuizQuestionCategory[]) => {
      defaultValues.categories = categories.map((el) => el.id as number);
      form.reset(defaultValues as unknown as FormInput);
    };
    categoriesStore.getCategories(callback);
  }, []);

  const submit: SubmitHandler<FormInput> = (data) => {
    quizStore.createQuiz(data);
  };

  return (
    <>
      <div className={classes.formDescription}>
        <span>Select conditions</span>
      </div>

      <Card>
        <Form
          autoComplete='off'
          layout='vertical'
          onFinish={form.handleSubmit(submit)}
          className={classes.form}
        >
          <div className={classes.flexField}>
            <Form.Item
              label='Questions Count'
              name='questionsCount'
              required={true}
              className={classes.questionsCountColumn}
            >
              <Controller
                name='questionsCount'
                control={form.control}
                rules={{ required: 'Required' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputNumber
                      min={1}
                      step={1}
                      formatter={formUtils.toFieldIntegerNumber}
                      status={formUtils.returnFieldStatus(fieldState)}
                      {...field}
                    />

                    {formUtils.drawError(fieldState)}
                  </>
                )}
              />
            </Form.Item>

            <Form.Item label='Levels'>
              <Input.Group compact>
                <Form.Item name='levelFrom' noStyle>
                  <Controller
                    name='levelFrom'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputNumber
                          min={1}
                          max={10}
                          step={1}
                          formatter={formUtils.toFieldIntegerNumber}
                          status={formUtils.returnFieldStatus(fieldState)}
                          placeholder='From'
                          {...field}
                        />

                        {formUtils.drawError(fieldState)}
                      </>
                    )}
                  />
                </Form.Item>
                <Form.Item name='levelTo' noStyle>
                  <Controller
                    name='levelTo'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputNumber
                          min={1}
                          max={10}
                          step={1}
                          formatter={formUtils.toFieldIntegerNumber}
                          status={formUtils.returnFieldStatus(fieldState)}
                          placeholder='To'
                          {...field}
                        />

                        {formUtils.drawError(fieldState)}
                      </>
                    )}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </div>

          <Form.Item name='categories' label='Categories' required={true}>
            <Controller
              name='categories'
              control={form.control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    placeholder='Select a option and change input text above'
                    status={formUtils.returnFieldStatus(fieldState)}
                    mode='multiple'
                    allowClear
                    loading={categoriesStore.isFetching}
                    {...field}
                  >
                    {categoriesStore.categories.map((category) => {
                      return (
                        <Select.Option value={category.id} key={category.id}>
                          {category.title}
                        </Select.Option>
                      );
                    })}
                  </Select>

                  {formUtils.drawError(fieldState)}
                </>
              )}
            />
          </Form.Item>

          <Button type='primary' size='large' htmlType='submit'>
            Create
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default observer(QuizConditionsForm);
