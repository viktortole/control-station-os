# Control Station OS - Testing Framework

## Overview
Comprehensive testing setup using Vitest and React Testing Library for unit and integration testing.

## Test Structure
```
src/tests/
├── setup.js              # Global test setup and mocks
├── useGameStore.test.js   # Core game logic tests
├── UserManager.test.js    # Authentication and user management tests
├── components/            # Component-specific tests
│   └── LoadingScreen.test.jsx
└── README.md             # This file
```

## Running Tests

### Development Mode (Watch)
```bash
npm run test
```

### Single Run
```bash
npm run test:run
```

### With Coverage Report
```bash
npm run test:coverage
```

### With UI Interface
```bash
npm run test:ui
```

## Test Categories

### 1. Core Logic Tests (`useGameStore.test.js`)
- **XP Management**: Adding XP, level calculations, concurrent processing protection
- **Task Management**: Creating, completing, and deleting tasks
- **Achievement System**: Unlocking achievements based on conditions
- **Settings**: Configuration updates and persistence
- **Statistics**: Tracking user progress and metrics
- **Error Handling**: Graceful handling of invalid operations

### 2. Authentication Tests (`UserManager.test.js`)
- **User Registration**: Account creation with validation
- **Authentication**: Login/logout flows with security checks
- **Rate Limiting**: Protection against brute force attacks
- **Data Management**: Secure storage and retrieval
- **User Discovery**: Listing and finding users
- **Security Features**: XSS prevention, data sanitization
- **Data Cleanup**: Safe deletion and clearing operations

### 3. Component Tests (`components/`)
- **LoadingScreen**: Progress display and completion handling
- **UI Interactions**: User input validation and feedback
- **Military Theming**: Consistent visual presentation
- **Accessibility**: Screen reader compatibility and keyboard navigation

## Test Configuration

### Vitest Setup (`vitest.config.js`)
- **Environment**: jsdom for browser simulation
- **Globals**: Access to test functions without imports
- **Coverage**: V8 provider with HTML/JSON reports
- **Setup Files**: Automatic mocking and test preparation

### Global Mocks (`setup.js`)
- **AudioContext**: Web Audio API simulation
- **Storage APIs**: localStorage and sessionStorage
- **Browser APIs**: navigator, performance, location
- **System Resources**: Memory usage and hardware info

## Writing New Tests

### Test File Structure
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComponentName from '../path/to/component'

describe('ComponentName', () => {
  beforeEach(() => {
    // Reset state before each test
  })

  describe('Feature Group', () => {
    it('should describe specific behavior', () => {
      // Test implementation
    })
  })
})
```

### Testing Patterns

#### Store Testing with Hooks
```javascript
import { renderHook, act } from '@testing-library/react'
import useGameStore from '../stores/useGameStore'

const { result } = renderHook(() => useGameStore())

act(() => {
  result.current.someAction()
})

expect(result.current.someState).toBe(expectedValue)
```

#### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react'

render(<Component prop="value" />)
const element = screen.getByRole('button')
fireEvent.click(element)
expect(screen.getByText('Expected Text')).toBeInTheDocument()
```

#### Async Testing
```javascript
import { waitFor } from '@testing-library/react'

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

#### Mock Functions
```javascript
const mockFn = vi.fn()
mockFn.mockReturnValue('test value')
expect(mockFn).toHaveBeenCalledWith(expectedArgs)
```

## Coverage Targets

### Current Coverage Goals
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >85%
- **Lines**: >80%

### Priority Areas
1. **Core Game Logic**: XP system, task management
2. **Authentication**: Security-critical functions
3. **Data Persistence**: Storage and retrieval operations
4. **User Interface**: Critical user interactions

## Best Practices

### Test Quality
- **Descriptive Names**: Tests should clearly describe what they verify
- **Single Responsibility**: Each test should verify one specific behavior
- **Arrange-Act-Assert**: Clear structure for test logic
- **Edge Cases**: Test boundary conditions and error scenarios

### Performance
- **Fast Execution**: Tests should run quickly for rapid feedback
- **Isolated Tests**: No dependencies between test cases
- **Mock External**: Avoid real network/file system operations
- **Cleanup**: Reset state between tests

### Maintenance
- **Update with Code**: Keep tests current with implementation changes
- **Refactor Safely**: Improve test code quality regularly
- **Document Changes**: Update test descriptions when behavior changes
- **Review Coverage**: Regularly check for untested code paths

## Debugging Tests

### Common Issues
1. **Async Timing**: Use `waitFor()` for asynchronous operations
2. **State Pollution**: Ensure proper cleanup in `beforeEach`
3. **Mock Conflicts**: Clear mocks between tests
4. **DOM Queries**: Use appropriate queries from Testing Library

### Debug Commands
```bash
# Run specific test file
npm run test useGameStore.test.js

# Run tests matching pattern
npm run test --grep "XP Management"

# Debug with console output
npm run test --reporter=verbose

# Generate detailed coverage
npm run test:coverage --reporter=lcov
```

## Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing naming conventions
3. Include comprehensive test coverage
4. Update this README if adding new patterns
5. Ensure all tests pass before committing

### Test Review Checklist
- [ ] Tests cover happy path scenarios
- [ ] Edge cases and error conditions tested
- [ ] Mocks are properly configured
- [ ] Tests are deterministic and stable
- [ ] Performance impact is acceptable
- [ ] Documentation is updated

---

**🎯 Goal: Maintain high-quality, reliable tests that ensure Control Station OS operates with military-grade precision and reliability.**