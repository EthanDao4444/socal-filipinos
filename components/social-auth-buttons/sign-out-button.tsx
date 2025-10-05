import { supabase } from '@/utils/supabase'
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

interface SignOutButtonProps {
  className?: string
}

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
  }
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onSignOutButtonPress}
      className={`bg-red-500 py-3 rounded-lg shadow-lg ${className || ''}`}
    >
      <Text className="text-white text-center text-lg font-semibold">
        Sign Out
      </Text>
    </TouchableOpacity>
  )
}