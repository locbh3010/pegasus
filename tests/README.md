# Playwright E2E Testing Suite

This directory contains comprehensive end-to-end tests for the Task Manager application, focusing on authentication flows and dashboard navigation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager
- Running Task Manager application on `localhost:3000`

### Installation
```bash
# Install Playwright and dependencies
yarn test:setup

# Or install manually
yarn add -D @playwright/test playwright
yarn test:install
```

### Running Tests
```bash
# Run all tests
yarn test

# Run tests with UI mode
yarn test:ui

# Run tests in headed mode (see browser)
yarn test:headed

# Run specific test suites
yarn test:auth          # Authentication tests
yarn test:dashboard     # Dashboard navigation tests
yarn test:oauth         # OAuth callback tests
yarn test:logout        # Logout functionality tests
yarn test:signin        # Sign-in flow tests

# Debug tests
yarn test:debug

# Generate and view reports
yarn test:report
```

## 📁 Test Structure

```
tests/
├── auth/                    # Authentication flow tests
│   ├── signin.spec.ts      # Sign-in functionality
│   ├── signup.spec.ts      # Sign-up functionality  
│   ├── oauth-callback.spec.ts # OAuth callback handling
│   └── logout.spec.ts      # Logout functionality
├── dashboard/              # Dashboard tests
│   └── navigation.spec.ts  # Navigation and UI tests
├── pages/                  # Page Object Models
│   ├── base-page.ts       # Base page class
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── fixtures/              # Test fixtures and helpers
├── config/               # Test configuration
├── utils/                # Test utilities and helpers
├── global-setup.ts       # Global test setup
└── global-teardown.ts    # Global test cleanup
```

## 🔧 Configuration

### Environment Variables
Create a `.env.test` file with the following variables:

```bash
# Application URLs
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!

# OAuth Testing (optional)
TEST_GOOGLE_OAUTH=false
TEST_GITHUB_OAUTH=false

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Test Configuration
The main configuration is in `playwright.config.ts`:

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Timeouts**: Configurable timeouts for different operations
- **Reporters**: HTML, JSON, JUnit reports
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure

## 🧪 Test Categories

### Authentication Tests

#### Sign-In Flow (`signin.spec.ts`)
- ✅ Form validation and user input
- ✅ Valid credential authentication
- ✅ Invalid credential error handling
- ✅ Network error scenarios
- ✅ OAuth button functionality
- ✅ Session persistence
- ✅ Accessibility testing

#### OAuth Callback (`oauth-callback.spec.ts`)
- ✅ Successful Google OAuth callback
- ✅ Successful GitHub OAuth callback
- ✅ Failed OAuth callback handling
- ✅ Callback timeout scenarios
- ✅ Invalid OAuth parameters
- ✅ Simple callback flow testing
- ✅ Performance measurement
- ✅ Visual regression testing

#### Logout Flow (`logout.spec.ts`)
- ✅ Successful logout from dashboard
- ✅ Loading states during logout
- ✅ Authentication state cleanup
- ✅ Timeout and error handling
- ✅ Multi-tab logout scenarios
- ✅ Protected route access prevention
- ✅ Performance measurement

### Dashboard Tests

#### Navigation (`navigation.spec.ts`)
- ✅ Navbar display and functionality
- ✅ User dropdown menu
- ✅ Page navigation between routes
- ✅ Browser back/forward navigation
- ✅ Deep linking support
- ✅ Responsive design testing
- ✅ Accessibility compliance
- ✅ Performance monitoring

## 🎯 Key Features Tested

### OAuth Callback Issues (Recently Fixed)
- **Timeout Protection**: Tests verify 15-second timeout handling
- **Code Exchange**: Validates proper OAuth code processing
- **Session Creation**: Ensures sessions are created successfully
- **Error Recovery**: Tests fallback mechanisms and error handling
- **Simple Callback**: Alternative callback flow testing

### Logout Hanging Issues (Recently Fixed)
- **Timeout Protection**: 5-second logout timeout validation
- **Error Handling**: Network error and timeout scenarios
- **State Cleanup**: Verification of complete auth state clearing
- **Multi-tab Behavior**: Logout synchronization across tabs
- **Performance**: Logout completion time measurement

### Dashboard Navigation
- **Navbar Functionality**: Logo, user dropdown, menu items
- **Route Protection**: Authentication guards on protected routes
- **Responsive Design**: Mobile, tablet, desktop viewports
- **User Information**: Display of user name, email, avatar
- **Accessibility**: Keyboard navigation, ARIA attributes

## 🔍 Page Object Model

The tests use the Page Object Model pattern for maintainable and reusable code:

### Base Page (`base-page.ts`)
- Common navigation methods
- Element interaction helpers
- Assertion utilities
- Error handling
- Screenshot capabilities

### Authentication Pages
- **SignInPage**: Sign-in form interactions and validations
- **SignUpPage**: Sign-up form and user registration
- **CallbackPage**: OAuth callback processing and monitoring

### Dashboard Pages
- **DashboardPage**: Main dashboard functionality and navigation
- Navigation between dashboard sections
- User dropdown interactions
- Logout flow management

## 🛠 Test Utilities

### Test Data Generation (`test-data.ts`)
- Unique email and username generation
- Strong/weak password creation
- OAuth parameter simulation
- Session data mocking

### Test Assertions
- URL pattern matching
- Element visibility checks
- Console error monitoring
- Network request validation

### Test Metrics
- Page load time measurement
- Action performance tracking
- Network request monitoring
- Console message collection

## 🚀 CI/CD Integration

### GitHub Actions
The test suite integrates with GitHub Actions for automated testing:

- **Multi-browser Testing**: Chrome, Firefox, Safari
- **Parallel Execution**: Separate jobs for auth and dashboard tests
- **Artifact Collection**: Test reports and screenshots
- **PR Comments**: Automated test result summaries

### Test Reports
- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Machine-readable test data
- **JUnit Report**: CI/CD integration format
- **GitHub Report**: PR comment integration

## 🐛 Debugging Tests

### Local Debugging
```bash
# Run tests in debug mode
yarn test:debug

# Run specific test with debugging
yarn test tests/auth/signin.spec.ts --debug

# Run tests with browser visible
yarn test:headed
```

### Visual Debugging
```bash
# Open Playwright UI for interactive debugging
yarn test:ui

# View test reports
yarn test:report
```

### Common Issues
1. **Application not running**: Ensure `yarn dev` is running on port 3000
2. **Test user setup**: Verify test user credentials in `.env.test`
3. **Supabase configuration**: Check Supabase URL and keys
4. **Browser installation**: Run `yarn test:install` if browsers are missing

## 📊 Test Coverage

The test suite covers:
- ✅ **Authentication Flows**: Sign-in, sign-up, OAuth, logout
- ✅ **Error Scenarios**: Network errors, timeouts, invalid data
- ✅ **Performance**: Load times, action durations
- ✅ **Accessibility**: Keyboard navigation, ARIA attributes
- ✅ **Responsive Design**: Mobile, tablet, desktop viewports
- ✅ **Visual Regression**: Screenshot comparisons
- ✅ **Cross-browser**: Chrome, Firefox, Safari compatibility

## 🔄 Continuous Improvement

The test suite is designed to:
- Catch authentication regressions early
- Validate recent OAuth callback and logout fixes
- Ensure consistent user experience across browsers
- Monitor performance and accessibility
- Provide detailed debugging information

For questions or issues with the test suite, please refer to the main project documentation or create an issue in the repository.
