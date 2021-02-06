import {gql, useQuery} from "@apollo/client";
import React from "react";
import {Badge, Card, CardBody, CardImg, CardText, CardTitle, Col, Row} from "reactstrap";

const rickandmorty = gql`
{
  reserve(id: "0x6b175474e89094c44da98b954eedeac495271d0f") {
    symbol
    liquidityRate
  }
}
`;


export const HomeMadeSubGraph = () => {

    const {loading, error, data} = useQuery(rickandmorty);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log(data);

    return <div>
        <Row xs="5">
            test
        </Row>
    </div>
}
