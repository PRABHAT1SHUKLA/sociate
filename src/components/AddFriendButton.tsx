"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation} from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import z from 'zod'
import { toast } from 'sonner'

import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { AddFriendData, addFriendValidator } from '@/lib/validators/add-friend'


const AddFriendButton = () => {

  const { register, handleSubmit, setError, formState: { errors } } = useForm<AddFriendData>({
    resolver: zodResolver(addFriendValidator)
  })

  const {mutate: addFriend, isLoading } = useMutation({
    mutationFn: async (email: string) => {
      const validatedEmail = addFriendValidator.parse({ email })

      const payload: AddFriendData = {
        email: validatedEmail.email
      }

      const { data } = await axios.post('/api/friends/add', payload)
      return data as string
    },
    onError: (err: any) => {
      if(err instanceof AxiosError) {
        return toast.error('email', { description: "Check your email" })
      }

      if (err instanceof z.ZodError) {
        return setError('email', { message: err.message })
      }

      if(err.response?.status === 401) {
        return toast.error("Login required.")
      }

      toast.error("There was an error", {
        description: "Could not create subreddit."
      })
    },

    onSuccess: () => {
      toast.success('Freind request sent')
    }
  })

  const onUserSubmit = (data: AddFriendData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onUserSubmit)} className='max-w-sm'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Add friend by E-Mail
      </label>

      <div className='mt-2 flex gap-4'>
        <Input 
          {...register('email')}
          type="email" 
          placeholder='you@example.com'
          className='focus:ring-indigo-600'
        />
        <Button isLoading={isLoading}>Add</Button>
      </div>

      {/* Showing Form Errors */}
      <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>

    </form>
  )
}

export default AddFriendButton