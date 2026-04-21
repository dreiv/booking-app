import { http } from '@/core/services/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddReview = (stayId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newReview: { authorName: string; rating: number; comment: string }) =>
      http.post(`/stays/${stayId}/reviews`, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays', stayId] })
    },
  })
}
