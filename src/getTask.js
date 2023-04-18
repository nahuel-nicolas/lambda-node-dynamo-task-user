const AWS = require("aws-sdk");


module.exports.getTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const taskResult = await dynamodb
    .get({
      TableName: "TaskTable",
      Key: { id },
    })
    .promise();
  const task = taskResult.Item;

  if (task.userId) {
    try {
      const userResult = await dynamodb
        .get({
          TableName: "UserTable",
          Key: { id: task.userId },
        })
        .promise();
      const user = userResult.Item;
      delete task.userId
      task.user = user;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    status: 200,
    body: task,
  };
};
