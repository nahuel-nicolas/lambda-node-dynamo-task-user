- for PUT tasks/id check dynamo.update documentation, fazt only update 'done' but we wanna update updatedAt, title, userId, etc... If some parameters are gotten undefined then don't update those, but the other ones
- on arn commit setup arn
make sure createdAt and updatedAt are ISO strings
also add user
change project structure src/ hello.js task/ user/
add task.userId
GET TASK show task.user: {id, username}
deploy commit by commit