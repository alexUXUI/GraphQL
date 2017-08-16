var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var app = express();

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    rollDice(numDice: Int, numSides: Int): [Int]
    biggerThanTen(number: Int!): Int
    sortArray(unsortedArray: [Int]!): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var rootValue = {
  rollDice: function ({numDice, numSides}) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },

// You have to destructure the args in to use even single args
  biggerThanTen: ({number}) => {
    return (number > 10) ? true : false;
  },

  sortArray: ({unsortedArray}) => unsortedArray.sort((a, b) => a - b),
};

const DICE_CONFIG = {
  schema,
  rootValue,
  graphiql: true,
}

app.use('/graphql/dice', graphqlHTTP(DICE_CONFIG));
app.listen(4001, () => console.log('Running a GraphQL API server at localhost:4001/graphql/dice'));
