import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import classes from './QuizConditionsForm.module.scss';
import { formUtils } from '../../utils';
import { QuizletQuestionCategory } from '../../models/category.model';
import { QuizCreationData, QuizData } from '../../models/quiz.model';
import QuizAPIInstance from '../../api/quiz.api';
import CategoriesAPIInstance from '../../api/categories.api';

type PropsType = {
  setQuizData: (quizData: QuizData | null) => void;
};

type FormInput = QuizCreationData;

const defaultValues = {
  questionsCount: 10,
  categories: [] as number[],
};

const QuizConditionsForm = (props: PropsType) => {
  const [categories, setCategories] = useState<QuizletQuestionCategory[]>([]);
  const [categoriesAreLoading, setCategoriesAreLoading] =
    useState<boolean>(false);

  const getCategories = () => {
    setCategoriesAreLoading(true);
    CategoriesAPIInstance.getCategories()
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
          defaultValues.categories = res.data.map((el) => el.id as number);
          form.reset(defaultValues as unknown as FormInput);
        }
      })
      .finally(() => {
        setCategoriesAreLoading(false);
      });
  };

  const form = useForm<FormInput>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    getCategories();
  }, []);

  const submit: SubmitHandler<FormInput> = (data) => {
    QuizAPIInstance.createQuiz(data).then((res) => {
      props.setQuizData(res.data || null);
    });
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
                    loading={categoriesAreLoading}
                    {...field}
                  >
                    {categories.map((category) => {
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

export default QuizConditionsForm;
