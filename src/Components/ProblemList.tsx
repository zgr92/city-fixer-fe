import { ReactElement } from 'react';
import Problem from "../Types/ProblemInterface";
import React from 'react';

export default function ProblemList(props: { problems: Problem[] }): ReactElement {
    const { problems } = props;
  
    let table;
  
    if (problems.length === 0) {
      table = <p>Lista jest pusta</p>;
    } else {
      table = (
        <table>
          <thead>
            <tr>
              <th>Długość geogr.</th>
              <th>Szerokość geogr.</th>
              <th>Lokalizacja</th>
              <th>Problem</th>
              <th>Propozycja rozwiązania</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={index}>
                <td>{problem.longtitude}</td>
                <td>{problem.latitude}</td>
                <td>{problem.locationDesc}</td>
                <td>{problem.problemDesc}</td>
                <td>{problem.proposedFix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  
    return (
      <div className="problem-list-container">
        <h2>Aktualna lista problemów</h2>
        {table}
      </div>
    );
  }