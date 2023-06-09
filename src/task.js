const { v4 } = require("uuid");
const {
    DynamoDBDocument
    } = require("@aws-sdk/lib-dynamodb"),
    {
    DynamoDB
    } = require("@aws-sdk/client-dynamodb");
const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");


const addTask = async (event) => {
  const dynamodb = DynamoDBDocument.from(new DynamoDB(), {
    marshallOptions: {
        removeUndefinedValues: true
    }
  });

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
    });

  return {
    statusCode: 200,
    body: JSON.stringify(newTask),
  };
};

const getTasks = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
  
    const result = await dynamodb.scan({ TableName: "TaskTable" });
  
    const tasks = result.Items;
  
    return {
      status: 200,
      body: {
        tasks,
      },
    };
};

const getTask = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
  
    const { id } = event.pathParameters;
  
    const taskResult = await dynamodb
      .get({
        TableName: "TaskTable",
        Key: { id },
      });
    const task = taskResult.Item;
  
    if (task.userId) {
      try {
        const userResult = await dynamodb
          .get({
            TableName: "UserTable",
            Key: { id: task.userId },
          });
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

const updateTask = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
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
      });
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "task updated",
      }),
    };
};

const deleteTask = async (event) => {
    const dynamodb = DynamoDBDocument.from(new DynamoDB());
    const { id } = event.pathParameters;
  
    await dynamodb
      .delete({
        TableName: "TaskTable",
        Key: {
          id,
        },
      });
  
    return {
      status: 200,
      body: {
        message: 'Deleted Task'
      }
    };
};

module.exports = {
    addTask: middy(addTask).use(httpJSONBodyParser()),
    getTasks,
    getTask,
    updateTask,
    deleteTask,
}