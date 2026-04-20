import { http } from "@/core/services/http";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { BookingPayload } from "../models";

export const useCheckout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: BookingPayload) => http.post("/bookings", data),
    onSuccess: () => {
      alert("Booking Successful!"); // Temporary, but effective for a demo
      navigate("/");
    },
  });
};
