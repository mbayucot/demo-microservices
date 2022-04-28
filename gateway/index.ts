import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import { readFileSync } from 'fs';

const port = process.env.APOLLO_PORT || 4001;
const embeddedSchema = process.env.APOLLO_SCHEMA_CONFIG_EMBEDDED == "true" ? true : false;

const config = {};

if (embeddedSchema){
    const supergraph = "/etc/config/supergraph.graphql"
    // @ts-ignore
    config['supergraphSdl'] = readFileSync(supergraph).toString();
    console.log('Starting Apollo Gateway in local mode ...');
    console.log(`Using local: ${supergraph}`)
} else {
    console.log('Starting Apollo Gateway in managed mode ...');
}

const index = new ApolloGateway(config);

const server = new ApolloServer({
    gateway: index,
    debug: true
});

server.listen( {port: port} ).then(({ url }) => {
    console.log(`🚀 Graph Router ready at ${url}`);
}).catch(err => {console.error(err)});
