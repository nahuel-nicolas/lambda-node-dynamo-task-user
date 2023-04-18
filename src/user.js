const { v4 } = require("uuid");
const {
        DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      {
        DynamoDB
      } = require("@aws-sdk/client-dynamodb");
const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");


const addUser = async (event) => {
  const dynamodb = DynamoDBDocument.from(new DynamoDB(), {
    marshallOptions: {
        removeUndefinedValues: true
    }
  });

  const { username, password } = event.body;
  const createdAt = (new Date()).toISOString();
  const updatedAt = (new Date()).toISOString();
  const id = v4();

  console.log("addUser.id: ", id);

  const newUser = {
    id,
    username,
    password,
    createdAt,
    updatedAt
  };

  await dynamodb
    .put({
      TableName: "UserTable",
      Item: newUser,
    });

  return {
    statusCode: 200,
    body: JSON.stringify(newUser),
  };
};

const getUsers = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
  
    const result = await dynamodb.scan({ TableName: "UserTable" });
  
    const users = result.Items;
  
    return {
      status: 200,
      body: {
        users,
      },
    };
};

const getUser = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
  
    const { id } = event.pathParameters;
  
    const result = await dynamodb
      .get({
        TableName: "UserTable",
        Key: { id },
      });
  
    const user = result.Item;
  
    return {
      status: 200,
      body: user,
    };
};

const updateUser = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
    const { id } = event.pathParameters;
  
    const { username, password, done } = JSON.parse(event.body);
    const updatedAt = (new Date()).toISOString();
  
    await dynamodb
      .update({
        TableName: "UserTable",
        Key: { id },
        UpdateExpression: "set username = :username, password = :password, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":username": username,
          ":password": password,
          ":updatedAt": updatedAt,
        },
        ReturnValues: "ALL_NEW",
      });
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "user updated",
      }),
    };
  };

const deleteUser = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
    const { id } = event.pathParameters;
  
    await dynamodb
      .delete({
        TableName: "UserTable",
        Key: {
          id,
        },
      });
  
    return {
      status: 200,
      body: {
        message: 'Deleted User'
      }
    };
};

module.exports = {
    addUser: middy(addUser).use(httpJSONBodyParser()),
    getUsers,
    getUser,
    updateUser,
    deleteUser
}