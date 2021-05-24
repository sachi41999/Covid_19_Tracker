import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

export const InfoBox1 = ({ title, cases, isRed, active, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "infobox--selected"} ${
        isRed && "infobox--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" className="infobox_title">
          {title}
        </Typography>
        <h2 className={`infobox_cases ${!isRed && "infobox_cases--green"}`}>
          {cases}
        </h2>
        <Typography color="textSecondary" className="infobox_total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};
