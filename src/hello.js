module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello Nahuel",
        input: event,
      },
      null,
      2
    ),
  };
};
