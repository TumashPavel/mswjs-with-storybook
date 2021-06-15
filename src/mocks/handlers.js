import { graphql } from "msw";

export const handlers = [
  graphql.query("GetUser", (req, res, ctx) => {
    const { login } = req.variables;

    return res(
      ctx.data({
        user: {
          login,
          name: "Eliza Hamilton",
          avatar_url: "/avatar.jpg",
        },
      })
    );
  }),
];
