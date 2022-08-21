import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Form, Input, InputNumber, Select, Typography } from 'antd';
import { formUtils } from '../../../utils';
import { QuizletQuestionCategory } from '../../../models/category.model';
import { CATEGORIES } from '../../../data/categories';
import { QuizCreationData, QuizData } from '../../../models/quiz.model';
import QuizAPIInstance from '../../../api/quiz.api';

type PropsType = {
  setQuizData: (quizData: QuizData | null) => void;
};

type FormInput = QuizCreationData;

const categories: QuizletQuestionCategory[] = JSON.parse(
  JSON.stringify(CATEGORIES),
);

const defaultValues = {
  questionsCount: 10,
  categories: categories.map((category) => category.id),
};

const QuizConditionsForm = (props: PropsType) => {
  const form = useForm<FormInput>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    form.reset(defaultValues as unknown as FormInput);
  }, []);

  const submit: SubmitHandler<FormInput> = (data) => {
    QuizAPIInstance.createQuiz(data).then((res) => {
      props.setQuizData(res.data || null);
    });
  };

  return (
    <div>
      <Typography.Title level={2}>Select conditions</Typography.Title>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
        autoComplete='off'
        onFinish={form.handleSubmit(submit)}
      >
        <Form.Item
          label='Questions Count'
          name='questionsCount'
          required={true}
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

        <Form.Item
          name='categories'
          label='Categories'
          required={true}
          wrapperCol={{ span: 6 }}
        >
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
                  {...field}
                >
                  {categories.map((category) => {
                    return (
                      <Select.Option value={category.id} key={category.id}>
                        {category.label}
                      </Select.Option>
                    );
                  })}
                </Select>

                {formUtils.drawError(fieldState)}
              </>
            )}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuizConditionsForm;
