import { Typography } from 'antd';
import { ControllerFieldState } from 'react-hook-form';

export const getEnumKeys = (en: {}): number[] => {
  return (
    Object.keys(en).filter((v) => isNaN(Number(v))) as (keyof typeof en)[]
  ).map((key) => {
    return en[key];
  });
};

const formUtilsTemplate = {
  returnFieldStatus(fieldState: ControllerFieldState) {
    return fieldState.isTouched && fieldState.error ? 'error' : '';
  },
  drawError(fieldState: ControllerFieldState) {
    return (
      fieldState.isTouched &&
      fieldState.error && (
        <div>
          <Typography.Text type='danger'>
            {fieldState.error.message}
          </Typography.Text>
        </div>
      )
    );
  },
};

export const formUtils = Object.freeze(formUtilsTemplate);
