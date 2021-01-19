import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StateProvider } from './state';
import InitialState from './state/initialState';
import Reducer from './state/reducer';
import "./index.css";
import App from "./App";

let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <StateProvider initialState={InitialState} reducer={Reducer}>
      <App subgraphUri={subgraphUri} />
    </StateProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
