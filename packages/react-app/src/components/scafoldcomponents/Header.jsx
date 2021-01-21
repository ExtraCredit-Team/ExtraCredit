import React from "react";
import { PageHeader } from "antd";
import {Button} from "reactstrap";

export default function Header() {
  return (
    <a href="" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Extra Credit"
        subTitle="Make use of Credit delegation"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
