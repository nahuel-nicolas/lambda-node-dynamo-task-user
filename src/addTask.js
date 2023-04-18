const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");


const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { title, description, userId } = event.body;
  const createdAt = (new Date()).toISOString();
  const updatedAt = (new Date()).toISOString();
  const id = v4();

  console.log("addTask.id: ", id);

  const newTask = {
    id,
    title,
    description,
    userId,
    createdAt,
    updatedAt,
    done: false,
  };

  await dynamodb
    .put({
      TableName: "TaskTable",
      Item: newTask,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newTask),
  };
};

module.exports.addTask = middy(addTask).use(httpJSONBodyParser());