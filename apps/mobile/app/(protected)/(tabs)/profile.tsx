import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { signOut, useSession } from "@/lib/auth-client";

function ProfilePage() {
  const { data: session } = useSession();

  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
      <Text>
        Hi
        {session?.user.name}
        !
      </Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
