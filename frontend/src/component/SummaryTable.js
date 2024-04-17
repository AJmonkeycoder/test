import React from 'react';

function SummaryTable({ onesCount, zerosCount, continuousOnesCount, continuousZerosCount }) {
  return (
    <div>
      <h2>Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total 1's</td>
            <td>{onesCount}</td>
          </tr>
          <tr>
            <td>Total 0's</td>
            <td>{zerosCount}</td>
          </tr>
          <tr>
            <td>Continuous 1's</td>
            <td>{continuousOnesCount}</td>
          </tr>
          <tr>
            <td>Continuous 0's</td>
            <td>{continuousZerosCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SummaryTable;
