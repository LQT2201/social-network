# Social Network Application

A full-stack social networking platform built with Next.js and Node.js, featuring real-time interactions, media sharing, and social connections.

## Features

- **Authentication**

  - Email & Password login
  - Google OAuth integration
  - JWT-based authentication
  - Password recovery system

- **Posts**

  - Create, edit, delete posts
  - Support for text, images, and videos
  - Like, comment, and share functionality
  - Polls and voting system

- **Social Interactions**
  - Follow/unfollow users
  - Real-time notifications
  - Comment threads and replies
  - User profiles and activity feeds

## Tech Stack

### Frontend

- Next.js 13+ (App Router)
- Redux Toolkit for state management
- Tailwind CSS for styling
- Socket.io-client for real-time features
- Cloudinary for media storage

### Backend

- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- Socket.io for real-time features
- Passport.js for OAuth

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB
- npm or yarn
- Cloudinary account
- Google OAuth credentials

### Environment Variables

Create `.env` files in both frontend and backend directories:

Frontend (.env.local):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Backend (.env):

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/social-network.git
cd social-network
```

2. Install frontend dependencies:

```bash
cd fe
npm install
```

3. Install backend dependencies:

```bash
cd BE
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd BE
npm run dev
```

2. Start the frontend development server:

```bash
cd fe
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Project Structure

```
social-network/
├── fe/                     # Frontend Next.js application
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── redux/            # Redux store and slices
│   └── public/           # Static assets
│
└── BE/                    # Backend Node.js application
    ├── controllers/      # Route controllers
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    ├── services/        # Business logic
    └── middlewares/     # Custom middlewares
```

## API Documentation

Detailed API documentation can be found in [api.md](BE/docs/api.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

Your Name - [@yourgithub](https://github.com/yourgithub)

Project Link: [https://github.com/yourusername/social-network](https://github.com/yourusername/social-network)
