import { z } from 'zod'

export const addFriendValidator = z.object({
  email: z.string().email()
})

export type AddFriendData = z.infer<typeof addFriendValidator>