# @rtk-query/graphql-fetch

Provides the facility to make requests to a graphql server

---

## Installation

```
npm install @rtk-query/graphql-fetch
yarn add @rtk-query/graphql-fetch
```

## Features

- Integration with rtk-query to be able to make mutations and queries towards a graphql server

## Options

- #### Basic fetch

A list of available properties can be found below. These must be passed to the containing `graphqlFetch` method.

| Property           | Type     | Description                                                                  |
| ------------------ | -------- | ---------------------------------------------------------------------------- |
| **url**            | _string_ | server url.                                                                  |
| **prepareHeaders** | function | return two functions, one on each parameter; 1- `setHeaders`, 2- `setHeader` |

#### Example

```typescript
import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlFetch } from "@rtk-query/graphql-fetch";
import gql from "graphql-tag";

interface IFruits {
  id: number;
  fruit_name: string;
}

interface IData {
  data: { filterFruitsFam: IFruits[] };
}

const FILTER_FRUITS_FAM = gql`
  query FilterFruitsFam($family: String) {
    filterFruitsFam(family: $family) {
      id
      scientific_name
      tree_name
      fruit_name
      family
      origin
      description
      bloom
      maturation_fruit
      life_cycle
      climatic_zone
    }
  }
`;

const fruitApi = createApi({
  reducerPath: "fruitApi",
  baseQuery: graphqlFetch({
    url: "https://fruits-api.netlify.app/graphql",
    prepareHeaders: (setHeaders, setHeader) => {
      // replace all headers with this new object
      setHeaders({
        authToken: "tokenValue",
      });

      // you add a header and this is concatenated with the other existing headers
      setHeader("authToken", "tokenValue");
    },
  }),
  endpoints: (builder) => ({
    filterFruitsFam: builder.query<IData, { family: string }>({
      query: (variables) => ({
        document: FILTER_FRUITS_FAM,
        variables,
      }),
    }),
  }),
});

const { useFilterFruitsFamQuery } = fruitApi;

export default function Test() {
  let content;

  const { data, isLoading } = useFilterFruitsFamQuery({ family: "Rosaceae" });

  if (isLoading) content = <div>Loading...</div>;
  if (data) {
    content = (
      <div>
        {data.data.filterFruitsFam.map((fruit) => (
          <div key={fruit.id}>
            <p> {fruit.id}</p>
            <p> {fruit.fruit_name}</p>
          </div>
        ))}
      </div>
    );
  }

  return <>{content}</>;
}
```
