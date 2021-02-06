import React from "react";
import ReactDOM from "react-dom";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import "./index.css";
import App from "./App";

let subgraphUri = "https://api.thegraph.com/subgraphs/name/aave/protocol\n";

const client = new ApolloClient({
    uri: subgraphUri,
    fetchOptions: {
        mode: 'no-cors',
    },
    cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App subgraphUri={subgraphUri}/>
    </ApolloProvider>,
    document.getElementById("root"),
);
