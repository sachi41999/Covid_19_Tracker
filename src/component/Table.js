import numeral from "numeral";
import React from "react";
import "./Table.css";
export const Table = ({ countries }) => {
  return (
    <div className="tabledata">
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};
