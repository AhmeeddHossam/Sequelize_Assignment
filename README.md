# Assignment 5 - Sequelize

Users / Posts / Comments REST APIs built with **Express** and **Sequelize** (MySQL).

## Run the project

```bash
npm install
```

Create the database in MySQL:

```sql
CREATE DATABASE assignment5;
```

Fill the `.env` file:

```env
PORT=3000

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=assignment5
DB_USER=root
DB_PASSWORD=your_password
```

Then:

```bash
npm start      # or: npm run dev
```

The tables are created automatically with `sequelize.sync()`.

## Folder structure

```
Assignment_5
├── index.js                        # server entry point
├── bonus.js                        # LeetCode 27 - Remove Element
├── Assignment5.postman_collection.json
└── src
    ├── index.routes.js             # mounts all the routers + 404 + error handler
    ├── database
    │   ├── dbConnection.js
    │   └── models
    │       ├── user.model.js       # sequelize.define()
    │       ├── post.model.js       # Model.init()  + paranoid
    │       ├── comment.model.js    # Model.init()
    │       └── index.js            # the relations between the models
    ├── middleware
    │   ├── catchError.js
    │   └── globalErrorHandler.js
    └── modules
        ├── user
        │   ├── user.controller.js
        │   └── user.routes.js
        ├── post
        │   ├── post.controller.js
        │   └── post.routes.js
        └── comment
            ├── comment.controller.js
            └── comment.routes.js
```

## Part 1 - Models

| Requirement | Where |
| --- | --- |
| Users with `sequelize.define()` | [src/database/models/user.model.js](src/database/models/user.model.js) |
| Posts with `Model.init()` | [src/database/models/post.model.js](src/database/models/post.model.js) |
| Comments with `Model.init()` | [src/database/models/comment.model.js](src/database/models/comment.model.js) |
| Built-in email format validation (`isEmail`) | user.model.js |
| Soft delete (`paranoid: true`) on posts | post.model.js |
| Custom validation `checkPasswordLength` (> 6) | user.model.js |
| Custom validation `checkNameLength` (> 2) inside a `beforeCreate` hook | user.model.js |

## Part 2 - APIs

### A - Users

| # | Method | URL | Description |
| --- | --- | --- | --- |
| 1 | POST | `/users/signup` | Create a user with `build()` + `save()`, rejects a duplicated email |
| 2 | PUT | `/users/:id` | `upsert()` based on the PK with `{ validate: false }` |
| 3 | GET | `/users/by-email?email=user1@gmail.com` | Find a user by his email |
| 4 | GET | `/user/:id` | Find a user by his PK without the `role` field |

### B - Posts

| # | Method | URL | Description |
| --- | --- | --- | --- |
| 1 | POST | `/posts` | Create a post with `new Post()` + `save()` |
| 2 | DELETE | `/posts/:postId` | Soft delete, only the owner can delete (`userId` in the body) |
| 3 | GET | `/posts/details` | All posts with their user and their comments |
| 4 | GET | `/posts/comment-count` | All posts with the number of their comments |

### C - Comments

| # | Method | URL | Description |
| --- | --- | --- | --- |
| 1 | POST | `/comments` | Bulk create (`bulkCreate`) |
| 2 | PATCH | `/comments/:commentId` | Update the content, only the owner (`userId` in the body) |
| 3 | POST | `/comments/find-or-create` | `findOrCreate` by post, user and content |
| 4 | GET | `/comments/search?word=the` | `findAndCountAll` with a `LIKE` on the content |
| 5 | GET | `/comments/newest/:postId` | The 3 most recent comments of a post |
| 6 | GET | `/comments/details/:id` | A comment by its PK with its user and its post |

## Notes

- `DELETE /posts/:postId` and `PATCH /comments/:commentId` take the id of the user
  performing the action from the request body (`{ "userId": 1 }`), as described in the
  assignment for the comment endpoint.
- The `password` column has an empty string as a database default, because
  `PUT /users/:id` skips the validation and its body may not contain a password.
  The `checkPasswordLength` validation still rejects any password shorter than
  7 characters on sign up.
- `DB_DIALECT=sqlite` can be used to run the project without a MySQL server
  (it needs `npm install sqlite3`), the default dialect is MySQL.

## Bonus

[bonus.js](bonus.js) contains the solution of **Remove Element** (LeetCode 27).
