import React from 'react';
import {ThemeProvider} from "styled-components";
import {observer} from "mobx-react-lite";
import AppRouter from "./components/AppRouter";
import {ApolloClient, ApolloProvider, InMemoryCache, split} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";
import {useThemeStore} from "./stores/themeStore";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";
import {getMainDefinition} from '@apollo/client/utilities';


const wsLink = new GraphQLWsLink(createClient({
    url: `${process.env.REACT_APP_API_WS_URL}/graphql`,
}));

const uploadLink = createUploadLink({
    credentials: "include",
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    uploadLink,
);

const apolloClient = new ApolloClient({
    cache: new InMemoryCache({resultCaching: false}),
    link: splitLink,
});


const App = observer(() => {
    const {currentTheme} = useThemeStore();

    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={currentTheme}>
                <AppRouter/>
            </ThemeProvider>
        </ApolloProvider>
    );
});

export default App;
