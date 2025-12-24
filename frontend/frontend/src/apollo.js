import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://127.0.0.1:8000/graphql/",
  headers: {
    Authorization: localStorage.getItem("token")
      ? `JWT ${localStorage.getItem("token")}`
      : "",
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
