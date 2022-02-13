import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { DocumentNode } from "graphql";
import { GraphQLClient, ClientError } from "graphql-request";

type P = Parameters<GraphQLClient["request"]>;
export type Document = P[0];
export type Variables = P[1];
export type ReturnRequestHeaders = P[2];
export type RequestHeaders = (
  setHeaders: (headers: RequestInit["headers"] | undefined) => GraphQLClient,
  setHeader: (key: string, value: string) => GraphQLClient
) => ReturnRequestHeaders;

export const graphqlFetch = (
  options:
    | {
        url: string;
        prepareHeaders?: RequestHeaders;
      }
    | {
        client: GraphQLClient;
        prepareHeaders: undefined;
      }
): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, "name" | "message" | "stack">,
  Partial<Pick<ClientError, "request" | "response">>
> => {
  const client =
    "client" in options ? options.client : new GraphQLClient(options.url);

  !!options.prepareHeaders &&
    options.prepareHeaders(client.setHeaders, client.setHeader);

  return async ({ document, variables }) => {
    try {
      return { data: await client.request(document, variables), meta: {} };
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error;
        return { error: { name, message, stack }, meta: { request, response } };
      }
      throw error;
    }
  };
};
