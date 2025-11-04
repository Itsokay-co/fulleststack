import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { authClient } from "@/lib/auth-client";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (ctx) => {
          Alert.alert("Error", ctx.error.message);
        },
        onSuccess: () => {},
      },
    );
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: (ctx) => {
          Alert.alert("Error", ctx.error.message);
        },
        onSuccess: () => {},
      },
    );
    setLoading(false);
  };

  const handleSubmit = () => {
    if (mode === "login") {
      handleSignIn();
    }
    else {
      handleSignUp();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <StatusBar style="dark" />
        <ScrollView style={styles.ScrollView}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>{mode === "login" ? "Welcome Back" : "Create Account"}</Text>
              <Text style={styles.paragraph}>
                {mode === "login" ? "Sign in to continue" : "Sign up to get started"}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                testID="email-input"
              />

              {mode === "signup" && (
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#666666"
                  value={name}
                  onChangeText={setName}
                  testID="name-input"
                />
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  testID="password-input"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {mode === "signup" && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  testID="confirm-password-input"
                />
              )}

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
                testID="submit-button"
              >
                {loading
                  ? (
                      <ActivityIndicator color="#fff" />
                    )
                  : (
                      <Text style={styles.submitButtonText}>
                        {mode === "login" ? "Sign In" : "Sign Up"}
                      </Text>
                    )}
              </TouchableOpacity>

              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <TouchableOpacity onPress={toggleMode} testID="toggle-mode-button">
                  <Text style={styles.toggleButtonText}>
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardView: {
    flex: 1,
  },
  ScrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    gap: 24,
    paddingTop: Platform.OS === "ios" ? 0 : 24,
  },
  headerContainer: {
    alignItems: "center",
    gap: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22C55E",
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  submitButton: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    color: "#333",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#22C55E",
  },
});
