const AWS = require("aws-sdk");


module.exports.getTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const result = await dynamodb
    .get({
      TableName: "TaskTable",
      Key: { id },
    })
    .promise();

  const task = result.Item;

  return {
    status: 200,
    body: task,
  };
};
