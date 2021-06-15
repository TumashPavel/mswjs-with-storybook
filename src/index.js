import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./ApolloClient";
import { GitHubUser } from "./GitHubUser";

// Start the mocking conditionally.
if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start();
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <GitHubUser username="qqq" />
  </ApolloProvider>,
  document.getElementById("root")
);
