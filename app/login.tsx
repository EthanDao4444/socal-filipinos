import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/default/themed-text'
import { ThemedView } from '@/components/default/themed-view'
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';

import * as Linking from 'expo-linking';

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Login</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Try to navigate to home screen!</ThemedText>
        </Link>
        <GoogleSignInButton />
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})