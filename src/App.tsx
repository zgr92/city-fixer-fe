import { useEffect, ReactElement } from 'react';
import './App.css';
import { useAppSelector, useAppDispatch } from './hooks';
import { selectAllProblems, fetchProblems } from './problemsSlice';
import React from 'react';
import ProblemList from './Components/ProblemList';
import ProblemForm from './Components/ProblemForm';

export default function App(): ReactElement {
  const problems = useAppSelector(selectAllProblems);
  let listElement = <p />;
  const dispatch = useAppDispatch();
  const problemsStatus = useAppSelector((state) => state.problems.status);

  useEffect(() => {
    if (problemsStatus === 'idle') {
      dispatch(fetchProblems());
    }
  }, [problemsStatus, dispatch]);

  listElement = <ProblemList problems={problems} />;

  if (problemsStatus === 'loading') {
    listElement = <p>Ładowanie listy problemów...</p>;
  }

  if (problemsStatus === 'failed') {
    listElement = <p>Wystąpił błąd</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <ProblemForm />
        {listElement}
      </header>
    </div>
  );
}