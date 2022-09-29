import React, { ElementRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import AddOrOverwriteConfirmModal from './AddOrOverwriteConfirmModal';

describe('AddOrOverwriteConfirmModal', () => {
  test('available to be opened outside the component', () => {
    const ref =
      React.createRef<ElementRef<typeof AddOrOverwriteConfirmModal>>();
    const mockOnAddSelected = jest.fn();
    const mockOnOverwriteSelected = jest.fn();

    render(
      <AddOrOverwriteConfirmModal
        ref={ref}
        onAddSelected={mockOnAddSelected}
        onOverwriteSelected={mockOnOverwriteSelected}
      />,
    );

    act(() => {
      ref.current?.openModal();
    });

    const modal = screen.getByRole('dialog');

    expect(modal).toBeInTheDocument();
  });

  test('should have three action buttons', () => {
    const ref =
      React.createRef<ElementRef<typeof AddOrOverwriteConfirmModal>>();
    const mockOnAddSelected = jest.fn();
    const mockOnOverwriteSelected = jest.fn();

    const { queryByRole } = render(
      <AddOrOverwriteConfirmModal
        ref={ref}
        onAddSelected={mockOnAddSelected}
        onOverwriteSelected={mockOnOverwriteSelected}
      />,
    );

    act(() => {
      ref.current?.openModal();
    });

    const cancelButton = queryByRole('button', {
      name: /return/i,
    });
    const addButton = queryByRole('button', {
      name: /add/i,
    });
    const overwriteButton = queryByRole('button', {
      name: /overwrite/i,
    });

    expect(cancelButton).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(overwriteButton).toBeInTheDocument();
  });

  test('return button should only close the modal', () => {
    const ref =
      React.createRef<ElementRef<typeof AddOrOverwriteConfirmModal>>();
    const mockOnAddSelected = jest.fn();
    const mockOnOverwriteSelected = jest.fn();

    const { queryByRole } = render(
      <AddOrOverwriteConfirmModal
        ref={ref}
        onAddSelected={mockOnAddSelected}
        onOverwriteSelected={mockOnOverwriteSelected}
      />,
    );

    act(() => {
      ref.current?.openModal();
    });

    const cancelButton = queryByRole('button', {
      name: /return/i,
    });

    userEvent.click(cancelButton as HTMLElement);

    const modal = screen.queryByRole('dialog');

    expect(modal).not.toBeInTheDocument();
  });

  test('add button should run function and close the modal', () => {
    const ref =
      React.createRef<ElementRef<typeof AddOrOverwriteConfirmModal>>();
    const mockOnAddSelected = jest.fn();
    const mockOnOverwriteSelected = jest.fn();

    const { queryByRole } = render(
      <AddOrOverwriteConfirmModal
        ref={ref}
        onAddSelected={mockOnAddSelected}
        onOverwriteSelected={mockOnOverwriteSelected}
      />,
    );

    act(() => {
      ref.current?.openModal();
    });

    const addButton = queryByRole('button', {
      name: /add/i,
    });

    userEvent.click(addButton as HTMLElement);

    const modal = screen.queryByRole('dialog');

    expect(mockOnAddSelected).toHaveBeenCalledWith();
    expect(modal).not.toBeInTheDocument();
  });

  test('overwrite button should run function and close the modal', () => {
    const ref =
      React.createRef<ElementRef<typeof AddOrOverwriteConfirmModal>>();
    const mockOnAddSelected = jest.fn();
    const mockOnOverwriteSelected = jest.fn();

    const { queryByRole } = render(
      <AddOrOverwriteConfirmModal
        ref={ref}
        onAddSelected={mockOnAddSelected}
        onOverwriteSelected={mockOnOverwriteSelected}
      />,
    );

    act(() => {
      ref.current?.openModal();
    });

    const overwriteButton = queryByRole('button', {
      name: /overwrite/i,
    });

    userEvent.click(overwriteButton as HTMLElement);

    const modal = screen.queryByRole('dialog');

    expect(mockOnOverwriteSelected).toHaveBeenCalledWith();
    expect(modal).not.toBeInTheDocument();
  });
});
