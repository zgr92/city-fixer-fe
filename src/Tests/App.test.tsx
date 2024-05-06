import { http, delay, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from './../App';
import ProblemList from './../Components/ProblemList';
import React from 'react';

import { render, waitForElementToBeRemoved, fireEvent } from '../test-utils';

const testProblemsResponse = [{
  longtitude: '42.434', latitude: '54.345', locationDesc: '123', problemDesc: '345', proposedFix: '456',
}, {
  longtitude: '76.345', latitude: '56.234', locationDesc: 'dfg', problemDesc: 'hfg', proposedFix: 'khj',
}, {
  longtitude: '56.434', latitude: '43.241', locationDesc: 'Opis lok 1', problemDesc: 'Opis prob 1', proposedFix: 'Rozw 1',
}, {
  longtitude: '43.467', latitude: '65.459', locationDesc: 'Opis lok 2', problemDesc: 'Opis prob 2', proposedFix: 'Rozw 2',
}, {
  longtitude: '65.324', latitude: '43.765', locationDesc: 'Opis lokalizacji 3', problemDesc: 'Opis problemu 3', proposedFix: 'Proponowane rozwi\u0105zane3',
}, {
  longtitude: '32.434', latitude: '32.543', locationDesc: 'dfsdf', problemDesc: 'fdssd', proposedFix: 'fsds',
}, {
  longtitude: '43.564', latitude: '45.654', locationDesc: 'jhkj', problemDesc: 'hkjh', proposedFix: 'jkh',
}];

const server = setupServer(
  http.get('http://127.0.0.1:8000/api/problems/', () => {
    return HttpResponse.json([])
  }),
  http.post('http://127.0.0.1:8000/api/problems/', () => {
    return HttpResponse.json([])
  }));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders submit btn', () => {
  const { getByRole } = render(<App />);
  const submitBtn = getByRole('button');
  expect(submitBtn).toBeInTheDocument();
});

test('submitting form btn change', async () => {
  const { getByRole, findByText, findByRole } = render(<App />);
  const submitBtn = getByRole('button');
  expect(submitBtn).toBeInTheDocument();
  expect(submitBtn).toHaveValue('Wyślij');

  fireEvent.click(submitBtn);

  const sendingText = await findByText('Wysyłanie...');
  expect(submitBtn).not.toBeInTheDocument();
  expect(sendingText).toBeInTheDocument();

  const submitBtnReturn = await findByRole('button');
  expect(submitBtnReturn).toBeInTheDocument();
  expect(submitBtn).toHaveValue('Wyślij');
});

test('submit problem and show it on problems list', async () => {
  const longtitude = '23.543';
  const latitude = '54.435';
  const locationDesc = 'Location description';
  const problemDesc = 'Problem description';
  const proposedFix = 'Proposed fix';
  server.use(
    http.post('http://127.0.0.1:8000/api/problems/', () => {
      return HttpResponse.json([{
        longtitude,
        latitude,
        locationDesc,
        problemDesc,
        proposedFix,
      }])
    }));

  const {
    getByRole, getByText, findByRole, findByText,
  } = render(<App />);

  await findByText('Lista jest pusta');

  fireEvent.input(getByRole('textbox', { name: /Długość geograficzna/i }), {
    target: { value: longtitude },
  });

  fireEvent.input(getByRole('textbox', { name: /Szerokość geograficzna/i }), {
    target: { value: latitude },
  });

  fireEvent.input(getByRole('textbox', { name: /Opis lokalizacji/i }), {
    target: { value: locationDesc },
  });

  fireEvent.input(getByRole('textbox', { name: /Opis problemu/i }), {
    target: { value: problemDesc },
  });

  fireEvent.input(getByRole('textbox', { name: /Proponowane rozwiązane/i }), {
    target: { value: proposedFix },
  });

  fireEvent.click(getByRole('button'));
  await findByText('Wysyłanie...');
  await findByRole('button');

  expect(getByText('23.543')).toBeInTheDocument();
  expect(getByText('54.435')).toBeInTheDocument();
  expect(getByText('Location description')).toBeInTheDocument();
  expect(getByText('Problem description')).toBeInTheDocument();
  expect(getByText('Proposed fix')).toBeInTheDocument();
});

test('empty list info', () => {
  const { getByText } = render(<ProblemList problems={[]} />);
  expect(getByText('Lista jest pusta')).toBeInTheDocument();
});

test('list loading', async () => {
  server.use(
    http.get('http://127.0.0.1:8000/api/problems/', async () => {
      await delay();

      return HttpResponse.json([{
        testProblemsResponse
      }])
    }));

  const { findByText } = render(<App />);

  const text = await findByText('Ładowanie listy problemów...');

  expect(text).toBeInTheDocument();
});

test('list loaded', async () => {
  server.use(
    http.get('http://127.0.0.1:8000/api/problems/', () => {
      return HttpResponse.json([{
        testProblemsResponse
      }])
    }));

  const { getByText, getByRole } = render(<App />);

  await waitForElementToBeRemoved(() => getByText('Ładowanie listy problemów...'));

  expect(getByRole('table')).toBeInTheDocument();
});

test('list show', async () => {
  const { getByText, getByRole } = render(<ProblemList problems={testProblemsResponse} />);

  expect(getByRole('table')).toBeInTheDocument();
  expect(getByText('42.434')).toBeInTheDocument();
  expect(getByText('54.345')).toBeInTheDocument();
  expect(getByText('123')).toBeInTheDocument();
  expect(getByText('345')).toBeInTheDocument();
  expect(getByText('456')).toBeInTheDocument();
});

test('list loading failed', async () => {
  server.use(
    http.get('http://127.0.0.1:8000/api/problems/', () => {return new HttpResponse(null, {
      status: 500,
    })}  ));

  const { findByText } = render(<App />);

  const text = await findByText('Wystąpił błąd');

  expect(text).toBeInTheDocument();
});
