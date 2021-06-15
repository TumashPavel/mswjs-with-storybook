import React from "react";
import { gql, useQuery } from "@apollo/client";
import "./GitHubUser.css";

const GET_USER = gql`
  query GetUser($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
    }
  }
`;

export const GitHubUser = ({ username }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { login: username },
    fetchPolicy: "no-cache",
  });

  const { name, login, avatar_url } = data?.user || {};

  const containerClassNames = [
    "container",
    loading && "loading",
    error && "error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassNames}>
      <div className="avatar-container">
        {avatar_url && <img className="avatar" src={avatar_url} alt={name} />}
      </div>
      {error ? (
        <div data-testid="error">
          <p>Failed to fetch a GitHub user.</p>
        </div>
      ) : (
        <div>
          <p className="name" data-testid="full-name">
            {name}
          </p>
          <p className="username">{login}</p>
        </div>
      )}
    </div>
  );
};
