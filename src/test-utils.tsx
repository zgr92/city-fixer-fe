import * as React from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from './store';
import problemsReducer from './problemsSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    initialState: Partial<RootState>
    store?: Store<Partial<RootState>>
}

const render = (
  component: React.ReactElement,
  {
    store = configureStore({ reducer: { problems: problemsReducer } }),
    ...renderOptions
  }: ExtendedRenderOptions = {
    initialState: {
      problems: {
        problems: [],
        status: 'idle',
        error: null,
      },
    },
  },
): RenderResult => rtlRender(component, {
  wrapper: TestWrapper(store),
  ...renderOptions,
});

// eslint-disable-next-line react/display-name
const TestWrapper = (store: Store) => ({
  children,
}: {
    children?: React.ReactNode,
}) => <Provider store={store}>{children}</Provider>;

export * from '@testing-library/react';
export { render };
