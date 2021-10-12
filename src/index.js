// const { ApolloServer } = require('apollo-server') // this is similar to the import statement
const { PrismaClient } = require('@prisma/client')
const { getUserId } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')


const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

const Subscription = require('./resolvers/Subscription')


//1
/*
    The typeDefs constant defines your GraphQL schema (more about this in a bit). Here, it defines a simple Query type with one field called info. This field has the type String!. The exclamation mark in the type definition means that this field is required and can never be null.
*/
// const typeDefs = `
//     type Query {
//         info: String!
//         feed: [Link!]!
//     }

//     type Mutation{
//         post(url: String!, description: String!): Link!
//     }
    
//     type Link {
//         id: ID!
//         description: String!
//         url: String!
//     }
// `

const fs = require('fs');
const path = require('path');
// 2
/*
   The resolvers object is the actual implementation of the GraphQL schema. Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info. 
*/
    // 1
    /*
        The links variable is used to store the links at runtime. For now, everything is stored only in-memory rather than being persisted in a database.
    */
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'

}]   

//1
/*
    You’re adding a new integer variable that simply serves as a very rudimentary way to generate unique IDs for newly created Link elements.

*/
// const resolvers = {
//     Query: {
//         // we did this to get the error message not accepting the null value for a filed whose schema-definition was non-string string 
//         // info: () => null, 

//         info: () => 'This is the API of a Hackernews Clone',
//         //2
//         /* 
//             You’re adding a new resolver for the feed root field. Notice that a resolver always has to be named exactly after the corresponding field from the schema definition.
//         */ 
//         // feed: () => links,
//         // `feed: async (parent, args, context, info) => { // get all the links regardless. SELECT * FROM links
//         //     return context.prisma.link.findMany()
//         // },`
//         link: (parent, { id }, { links }) => {
//             const linkIndex = links.indexOf(l => l.id = id)
//             return links[linkIndex]
//         }

//     },// first execution level
//     Mutation: {
//         // 2

//         /*
//             The implementation of the post resolver first creates a new link object, then adds it to the existing links list and finally returns the new link.
//         */ 
//         // post: (parent, args) => {

//         // let idCount = links.length

//         //     const link = {
//         //         id: `link-${idCount++}`,
//         //         description: args.description,
//         //         url: args.url,
//         //     }
//         //     links.push(link)
//         //     return link
//         // }
//         post: (paremnt, args, context) => {
//             const newLink = context.prisma.link.create({
//                 data: {
//                     url: args.url,
//                     description: args.description,
//                 },
//             })
//             return newLink
//         },
//     },
//     // 3
//     /*
//         Finally, you’re adding three more resolvers for the fields on the Link type from the schema definition. We’ll discuss what the parent argument that’s passed into the resolver here is in a bit.

//     */
//     // Link: {// second execution level
//     //     id: (parent) => parent.id,// The first argument, commonly called parent (or sometimes root) is the result of the previous resolver execution level. 
//     //     description: (parent) => parent.description,
//     //     url: (parent) => parent.url,
//     // }

// }
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
}

// 3
/*
    Finally, the schema and resolvers are bundled and passed to ApolloServer which is imported from apollo-server. This tells the server what API operations are accepted and how they should be resolved.
*/

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// })

const prisma = new PrismaClient()
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    // context: {
    //     prisma,
    // }
    context: ({ req }) => {
        return {
          ...req,
          prisma,
          pubsub,
          userId:
            req && req.headers.authorization
              ? getUserId(req)
              : null
        };
    }
});


server
    .listen() // first listen, to keep the port open if any request comes
    .then(({ url }) => // then look at the url
        console.log(`Server is running on ${url}`)
    );
