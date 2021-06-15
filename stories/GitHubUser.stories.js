import React from "react";
import { graphql } from "msw";
import { GitHubUser } from "../src/GitHubUser";
import { worker } from "../src/mocks/browser";
import { client } from "../src/ApolloClient";
import { ApolloProvider } from "@apollo/client";

export default {
  title: "GitHub User",
  component: GitHubUser,
  decorators: [
    (Story) => {
      // Reset request handlers added in individual stories.
      worker.resetHandlers();
      return <Story />;
    },
  ],
};

export const DefaultBehavior = () => (
  <ApolloProvider client={client}>
    <GitHubUser username="hamilton.elly" />
  </ApolloProvider>
);

export const LoadingState = () => (
  <ApolloProvider client={client}>
    <GitHubUser username="hamilton.elly" />
  </ApolloProvider>
);
LoadingState.decorators = [
  (Story) => {
    worker.use(
      graphql.query("GetUser", (req, res, ctx) => {
        return res(ctx.delay("infinite"));
      })
    );

    return <Story />;
  },
];

export const ErrorState = () => (
  <ApolloProvider client={client}>
    <GitHubUser username="hamilton.elly" />
  </ApolloProvider>
);
ErrorState.decorators = [
  (Story) => {
    worker.use(
      graphql.query("GetUser", (req, res, ctx) => {
        return res.once(ctx.status(500));
      })
    );

    return <Story />;
  },
];

// Internal parameters used for testing this usage example.
// This does NOT have to be in your Storybook.
DefaultBehavior.parameters = {
  async puppeteerTest(page) {
    await page.reload();
    await page.waitFor('[data-testid="full-name"');

    // This is but a minor sacrifice to please the Puppeteer gods.
    // Removing this line executes the story in a "No story selected"
    // state, despite the command above to await the element.
    await page.waitForResponse("https://api.github.com/users/hamilton.elly");

    const fullName = await page.$eval(
      '[data-testid="full-name"',
      (element) => element.textContent
    );

    expect(fullName).toBe("Eliza Hamilton");
  },
};
