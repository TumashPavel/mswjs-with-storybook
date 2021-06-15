import React from "react";
import { ApolloProvider } from "@apollo/client";
import { render, screen, wait } from "@testing-library/react";
import { client } from "./ApolloClient";
import { server } from "./mocks/server";
import { graphql } from "msw";

import { GitHubUser } from "./GitHubUser";

describe("GitHubUser", () => {
  it("should render component properly", async () => {
    const { findByTestId } = render(
      <ApolloProvider client={client}>
        <GitHubUser user="some-user" />
      </ApolloProvider>
    );

    const name = await findByTestId("full-name");
    await wait(() => expect(name).toHaveTextContent("Eliza Hamilton"));
  });

  it("should show error message on failed", async () => {
    server.use(
      graphql.query("GetUser", (req, res, ctx) => {
        return res.once(ctx.status(500));
      })
    );
    const { queryByTestId } = render(
      <ApolloProvider client={client}>
        <GitHubUser user="some-user" />
      </ApolloProvider>
    );

    await wait(() => expect(queryByTestId("error")).toBeInTheDocument());
  });
});
