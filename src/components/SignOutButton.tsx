"use client"

import { ButtonHTMLAttributes, FC, useState } from 'react'
import { Button } from './ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
  const [isLoading, setIsLoading] = useState(false)

  const signingOut = async () => {
    setIsLoading(true)
    try {
      // throw new Error("hello")
      await signOut()
    } catch (error) {
      toast.error('There was a problem signing out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button {...props} variant='ghost' onClick={signingOut} isLoading={isLoading} >
      {!isLoading && <LogOut className='h-4 w-4' />}
    </Button>
  )
}

export default SignOutButton