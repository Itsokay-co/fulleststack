# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the mobile application.

## Overview

Expo React Native application using Expo Router for file-based navigation and NativeWind for Tailwind CSS styling.

## Commands

```sh
# Development
pnpm dev            # Start Expo dev server
pnpm start          # Alternative start command
pnpm android        # Run on Android
pnpm ios            # Run on iOS
pnpm web            # Run in web browser

# Quality
pnpm typecheck      # Type check with TypeScript
pnpm lint           # Lint with ESLint (expo lint)
pnpm test           # Run tests with Jest

# Maintenance
pnpm upgrade-expo   # Upgrade Expo to latest version
```

## Architecture

### File-Based Routing

Expo Router provides automatic navigation based on file structure:

```
app/
├── _layout.tsx              # Root layout
├── (tabs)/                  # Tab group
│   ├── _layout.tsx          # Tab navigator layout
│   ├── index.tsx            # Home tab
│   └── profile.tsx          # Profile tab
├── (protected)/             # Protected route group
│   ├── _layout.tsx          # Auth guard layout
│   └── dashboard.tsx        # Protected dashboard
├── auth/                    # Authentication screens
│   ├── login.tsx            # Login screen
│   └── register.tsx         # Register screen
├── modal.tsx                # Modal screen
└── +not-found.tsx           # 404 screen
```

**Key Conventions**:
- `()` for route groups (like tabs, protected routes)
- `[]` for dynamic parameters
- `+` prefix for special routes (not-found, sitemap)

### Navigation

```typescript
import { router } from "expo-router";

// Navigate to a route
router.push("/profile");
router.replace("/dashboard");

// Navigate with parameters
router.push({
  pathname: "/task/[id]",
  params: { id: taskId }
});
```

### Tab Navigation

```typescript
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
    </Tabs>
  );
}
```

## Styling with NativeWind

Use Tailwind CSS classes via className prop:

```typescript
import { View, Text } from 'react-native';

export default function Component() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold text-gray-900 mb-4">
        Mobile Component
      </Text>
    </View>
  );
}
```

## Authentication

Use @better-auth/expo for native authentication:

```typescript
import { useAuth } from '@better-auth/expo';

export default function AuthScreen() {
  const { signIn, signOut, user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return user ? <Dashboard /> : <LoginForm />;
}
```

### Route Protection

Implement auth guards with layouts:

```typescript
// (protected)/_layout.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Redirect href="/auth/login" />;

  return <Slot />;
}
```

## Data Fetching

Use the shared API client from @fulleststack/api-client:

```typescript
import apiClient from '@fulleststack/api-client';

// Fetch data
const fetchTasks = async () => {
  const response = await apiClient.tasks.$get();
  return response.json();
};
```

## Component Patterns

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      className={`px-4 py-2 rounded-lg ${
        variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onPress={onPress}
    >
      <Text className={`text-center font-medium ${
        variant === 'primary' ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </Text>
    </Pressable>
  );
}
```

## Native Features

### Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // Handle press logic
};
```

### Blur Effects

```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="light">
  <Text>Blurred Content</Text>
</BlurView>
```

### Status Bar Management

```typescript
import { StatusBar } from 'expo-status-bar';

<StatusBar style="auto" />
```

## Platform-Specific Code

```typescript
import { Platform } from "react-native";

const styles = {
  container: Platform.select({
    ios: "pt-12",
    android: "pt-8",
  }),
};

// Or using Platform.OS
{Platform.OS === 'ios' && <IOSOnlyComponent />}
```

## Testing

Use Jest with jest-expo preset:

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPressMock} />);

    fireEvent.press(getByText('Test'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
```

## Performance

- Use FlatList for long lists with proper optimization
- Implement lazy loading for heavy components
- Optimize images with expo-image
- Use React.memo for expensive renders
- Use proper navigation options for better performance

## Best Practices

- Use Expo Router file-based routing conventions
- Implement route protection with layout components
- Use NativeWind for all styling (avoid StyleSheet)
- Handle authentication with @better-auth/expo
- Store sensitive data with expo-secure-store
- Use native features like haptics and blur appropriately
- Test on both iOS and Android platforms
- Use platform-specific code when necessary
- Follow React Native performance best practices
- Implement proper loading states for mobile UX
