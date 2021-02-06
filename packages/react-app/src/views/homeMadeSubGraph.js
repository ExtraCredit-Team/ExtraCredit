import {gql, useQuery} from "@apollo/client";
import React from "react";
import {Row} from "reactstrap";

const aaveDaiInterest = gql`{
  reserve(id: "0x6b175474e89094c44da98b954eedeac495271d0f") {
    symbol
    liquidityRate
  }
}
`;


export const HomeMadeSubGraph = () => {

    const {loading, error, data} = useQuery(aaveDaiInterest);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;


    return <div>
        <Row xs="5">
            {(data.reserve.liquidityRate*100).toFixed(2)}
        </Row>
    </div>
}
