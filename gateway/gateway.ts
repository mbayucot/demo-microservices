// Open Telemetry (optional)
import { ApolloOpenTelemetry } from 'apollo-server-lambda';

if (process.env.APOLLO_OTEL_EXPORTER_TYPE) {
    new ApolloOpenTelemetry({
        type: 'router',
        name: 'router',
        exporter: {
            type: process.env.APOLLO_OTEL_EXPORTER_TYPE, // console, zipkin, collector
            host: process.env.APOLLO_OTEL_EXPORTER_HOST,
            port: process.env.APOLLO_OTEL_EXPORTER_PORT,
        }
    }).setupInstrumentation();
}

// Main
import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import { readFileSync } from 'fs';

const port = process.env.APOLLO_PORT || 4000;
const embeddedSchema = process.env.APOLLO_SCHEMA_CONFIG_EMBEDDED == "true" ? true : false;

const config = {};

if (embeddedSchema){
    const supergraph = "/etc/config/supergraph.graphql"
    config['supergraphSdl'] = readFileSync(supergraph).toString();
    console.log('Starting Apollo Gateway in local mode ...');
    console.log(`Using local: ${supergraph}`)
} else {
    console.log('Starting Apollo Gateway in managed mode ...');
}

const gateway = new ApolloGateway(config);

const server = new ApolloServer({
    gateway: gateway,
    debug: true,
    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false
});

server.listen( {port: port} ).then(({ url }) => {
    console.log(`🚀 Graph Router ready at ${url}`);
}).catch(err => {console.error(err)});
