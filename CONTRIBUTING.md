# Contributing to AI Chatbot Builder

Thank you for your interest in contributing to AI Chatbot Builder! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

## Code Style

### Backend (JavaScript)

- Use ESLint for linting
- Follow Express.js best practices
- Use async/await for asynchronous operations
- Add comments for complex logic
- Keep functions small and focused

### Frontend (TypeScript/Next.js)

- Use TypeScript for type safety
- Follow Next.js best practices
- Use functional components with hooks
- Keep components modular and reusable
- Use Tailwind CSS for styling

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: Add user authentication middleware
fix: Resolve CORS error in production
docs: Update API documentation
```

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Make sure all tests pass
3. Update documentation if needed
4. Write a clear description of changes
5. Reference any related issues
6. Request review from maintainers

## Adding Features

### Backend

1. Create/update model if needed
2. Add route in appropriate routes file
3. Add controller logic
4. Add middleware if needed
5. Test endpoints
6. Update API documentation

### Frontend

1. Create/update component if needed
2. Add page or route
3. Update API calls
4. Test functionality
5. Ensure responsive design
6. Update documentation

## Testing

### Manual Testing Checklist

- [ ] Authentication works correctly
- [ ] Bot creation with/without files
- [ ] Chat functionality
- [ ] Analytics display correctly
- [ ] Mobile responsive
- [ ] Error handling works

### Adding Automated Tests

We encourage adding unit and integration tests:

```javascript
// Example test
describe('User Model', () => {
  it('should hash password before saving', async () => {
    // Test implementation
  });
});
```

## Documentation

- Update README.md for major changes
- Update API.md for API changes
- Add code comments for complex logic
- Update inline documentation

## Bugs

Found a bug? Please create an issue with:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment (OS, browser, etc.)

## Feature Requests

Have an idea? Create an issue with:

- Clear description of the feature
- Use case or problem it solves
- Potential implementation ideas
- Mockups or examples if applicable

## Security

Found a security vulnerability? Please email security@example.com instead of creating a public issue.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Be open to feedback
- Focus on constructive discussions

## Questions?

Open a discussion on GitHub or reach out to maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

