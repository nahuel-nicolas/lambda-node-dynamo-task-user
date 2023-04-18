const uuid = require("uuid");
const AWS = require("aws-sdk");


module.exports.updateTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  const { title, description, userId, done } = JSON.parse(event.body);
  const updatedAt = (new Date()).toISOString();

  await dynamodb
    .update({
      TableName: "TaskTable",
      Key: { id },
      UpdateExpression: "set title = :title, description = :description, userId = :userId, updatedAt = :updatedAt, done = :done",
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":userId": userId,
        ":updatedAt": updatedAt,
        ":done": done,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "task updated",
    }),
  };
};
