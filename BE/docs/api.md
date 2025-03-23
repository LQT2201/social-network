# API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication APIs

### User Authentication

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/auth/signup`        | Register new user    |
| POST   | `/auth/signin`        | Login user           |
| POST   | `/auth/logout`        | Logout user          |
| POST   | `/auth/refresh-token` | Get new access token |

### Social Authentication

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/auth/google`          | Initialize Google OAuth |
| GET    | `/auth/google/callback` | Google OAuth callback   |

### Password Recovery

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/auth/forgot-password` | Send password reset email |
| POST   | `/auth/reset-password`  | Reset password with OTP   |

## Post APIs

### Post Management

| Method | Endpoint     | Description                     |
| ------ | ------------ | ------------------------------- |
| POST   | `/posts`     | Create new post                 |
| GET    | `/posts`     | Get all posts (with pagination) |
| GET    | `/posts/:id` | Get single post                 |
| PUT    | `/posts/:id` | Update post                     |
| DELETE | `/posts/:id` | Delete post                     |

### Post Interactions

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | `/posts/:id/like`  | Like/unlike post |
| POST   | `/posts/:id/share` | Share post       |
| POST   | `/posts/:id/vote`  | Vote in poll     |

## Comment APIs

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| POST   | `/posts/:postId/comments`    | Create comment      |
| POST   | `/comments/:commentId/reply` | Reply to comment    |
| POST   | `/comments/:commentId/like`  | Like/unlike comment |
| GET    | `/posts/:postId/comments`    | Get post comments   |

## Notification APIs

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/notifications`          | Get user notifications |
| POST   | `/notifications/:id/read` | Mark as read           |

## User Profile APIs

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/users/profile`       | Get current user profile |
| PUT    | `/users/profile`       | Update user profile      |
| GET    | `/users/:id`           | Get user by ID           |
| POST   | `/users/:id/follow`    | Follow/unfollow user     |
| GET    | `/users/:id/followers` | Get user followers       |
| GET    | `/users/:id/following` | Get user following       |

## Request Headers

```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

## Common Query Parameters

| Parameter | Description          | Default        |
| --------- | -------------------- | -------------- |
| page      | Page number          | 1              |
| limit     | Items per page       | 10             |
| sort      | Sort field and order | createdAt:desc |

## Response Format

```javascript
{
  "status": "success",
  "code": 200,
  "message": "Operation successful",
  "metadata": {
    // Response data
  }
}
```

## Error Response Format

```javascript
{
  "status": "error",
  "code": 400,
  "message": "Error message"
}
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## File Upload

- Maximum file size: 10MB
- Supported formats: jpg, jpeg, png, gif, mp4, mov
- Maximum 5 files per request
