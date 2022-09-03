import { Typography } from 'antd';
import { ControllerFieldState } from 'react-hook-form';

const formUtilsTemplate = {
  toFieldIntegerNumber(value: number | string | undefined) {
    return `${value}`.replaceAll('.', '');
  },
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
