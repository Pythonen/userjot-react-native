# UserJot React Native SDK

> **Beta Notice**: This SDK is currently in beta (v0.3.0). The API may change before the 1.0 release.

> **NB**: This SDK is a 'mirror' from [UserJot Swift SDK](https://github.com/UserJot/userjot-ios/tree/main)

A React Native SDK for integrating [UserJot](https://userjot.com) feedback, roadmap, and changelog widgets into your mobile applications.

## Installation

```bash
npm install userjot-react-native react-native-webview
```

`react-native-webview` is a required peer dependency.

## Quick Start

### 1. Setup

Initialize UserJot with your project ID (found in your [UserJot dashboard](https://userjot.com)):

```tsx
import { UserJot } from "userjot-react-native";

UserJot.setup("your-project-id");
```

### 2. Identify Users

Identify users to enable personalized feedback tracking:

```tsx
// Minimal identification (only id required)
UserJot.identify({ id: "user123" });

// With additional details
UserJot.identify({
  id: "user123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "https://example.com/avatar.jpg",
});

// With server-side signature for secure authentication
UserJot.identify({
  id: "user123",
  email: "user@example.com",
  signature: signatureFromYourServer, // HMAC-SHA256 signature
});
```

### 3. Show Widgets

Use the provided components to display feedback, roadmap, or changelog:

```tsx
import {
  UserJotFeedback,
  UserJotRoadmap,
  UserJotChangelog,
} from "userjot-react-native";

function App() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <View>
      <Button title="Feedback" onPress={() => setShowFeedback(true)} />

      <UserJotFeedback
        visible={showFeedback}
        board="feature-requests" // optional: target a specific board
        onClose={() => setShowFeedback(false)}
      />

      <UserJotRoadmap
        visible={showRoadmap}
        onClose={() => setShowRoadmap(false)}
      />

      <UserJotChangelog
        visible={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </View>
  );
}
```

Each widget renders in a native modal with a WebView. Users can dismiss via the close button.

### 4. Logout

Clear user identification when users log out:

```tsx
UserJot.logout();
```

## API Reference

### `UserJot`

| Method                        | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `UserJot.setup(projectId)`    | Initialize the SDK with your project ID                     |
| `UserJot.identify(user)`      | Identify the current user                                   |
| `UserJot.logout()`            | Clear user identification                                   |
| `UserJot.ready()`             | Returns a promise that resolves when SDK metadata is loaded |
| `UserJot.feedbackURL(board?)` | Get the feedback URL directly                               |
| `UserJot.roadmapURL()`        | Get the roadmap URL directly                                |
| `UserJot.changelogURL()`      | Get the changelog URL directly                              |

### Components

| Component            | Props                          |
| -------------------- | ------------------------------ |
| `<UserJotFeedback>`  | `visible`, `onClose`, `board?` |
| `<UserJotRoadmap>`   | `visible`, `onClose`           |
| `<UserJotChangelog>` | `visible`, `onClose`           |

### `UserJotUser`

```tsx
interface UserJotUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  signature?: string;
}
```

## Server-Side Signature (Optional)

For enhanced security, generate HMAC-SHA256 signatures on your server:

```javascript
const crypto = require("crypto");

function generateSignature(userId, secret) {
  return crypto.createHmac("sha256", secret).update(userId).digest("hex");
}
```

Then pass the signature when identifying:

```tsx
UserJot.identify({
  id: "user123",
  email: "user@example.com",
  signature: signatureFromServer,
});
```

## Requirements

- React Native >= 0.65
- React >= 17
- react-native-webview >= 11

## License

MIT License - see LICENSE file for details.
