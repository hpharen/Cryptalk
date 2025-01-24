# CRYPTALK
## Phase 1 - User Authentication & Basic Chat
### Backend
[x] Set up user authentication with JWT and bcrypt
- Implement routes for registration and login
- Create basic chat API for sending and receiving messages
### Frontend
- Design simple registration/login page with fields for username and password
- Create basic chat window with message input area and message display
## Phase 2 - Encryption & Secure Messaging
### Encryption
- Libsodium for encrypting messages before sending, decrypting upon receiving
- Encrypt messages on client-side and ensure only recipient can decrypt them
### Socket.IO Integration
- Real-time communication with Socket.IO
- Messages encrypted before being sent over WebSocket connection
## Phase 3 - Data Purge & User Settings
### Account Deletion
- Implement user settings button to permanently delete account and data
- Should trigger server-side process to delete all personal data, messages, files from database and disk
## Phase 4 - Full-Scale Testing & Deployment
### Testing
- Test end-to-end functionality, encryption, and data deletion
- Run security audits to ensure no data leaks
### Deploy
- Use docker to containerize app for easier deployment
- Host app on a service like DigitalOcean, AWS, Heroku

## Security Considerations
- Password Management: Never store plaintext, always use bcrypt to hash passwords
- HTTPS: Ensure all communications happen over HTTPS to prevent MITM
- Data Retention: Implement strict data retention policies (no logs, complete data purge option)
- Regular Security Audits: Periodically review for vulnerabilities (SQL Injection, XSS, CSRF)

## Dependencies
- express: Framework for handling routes and middleware
- bcryptjs: Hashing algorithm for passwords on server-side storage
- pg: PostgresSQL client for Node.js
- jsonwebtoken: JWT creating secure authentication tokens, authentication & authorization mechanism
- dotenv: Management of environment variables
