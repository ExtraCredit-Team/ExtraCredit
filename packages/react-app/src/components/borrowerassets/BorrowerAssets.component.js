import React from "react";

import {Button, Card, CardHeader, Col, Row, Table} from "reactstrap";
import {formatEther} from "@ethersproject/units";
import {gql, useQuery} from "@apollo/client";

// core components


const aaveDaiInterest = gql`{
  reserve(id: "0x6b175474e89094c44da98b954eedeac495271d0f") {
    symbol
    liquidityRate
  }
}
`;

export function BorrowerAssets({props}) {

    const {data} = useQuery(aaveDaiInterest);
    let daiBorrowInterestRate=0;

    if (data)
        daiBorrowInterestRate = data.reserve.liquidityRate;

    return (
        <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="10">
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h3 className="mb-0">Margin Account Holdings</h3>
                            </div>
                            <div className="col text-right">
                                <Button
                                    color="primary"
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                    size="sm"
                                >
                                    See all
                                </Button>
                            </div>
                        </Row>
                    </CardHeader>
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th scope="col">Asset</th>
                            <th scope="col">Price</th>
                            <th scope="col">Borrowing rate</th>
                            <th scope="col">Borrowed value</th>
                            <th scope="col">Held Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">DAI</th>
                            <td>1$</td>
                            <td><strong>{(daiBorrowInterestRate * 100).toFixed(2)} %</strong></td>
                            <td>
                                <i className="fas fa-equals text-warning mr-3"/>{" "}
                                ${props.totalBorrowedAmount && parseFloat(formatEther(props.totalBorrowedAmount.toString()))}
                            </td>
                            <td>{props.totalBorrowedAmount && parseFloat(formatEther(props.totalBorrowedAmount.toString()))}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card>
            </Col>
        </Row>
    );
}
