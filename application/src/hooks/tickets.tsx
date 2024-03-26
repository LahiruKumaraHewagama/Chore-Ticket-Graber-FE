import { useState } from "react";
import { AxiosResponse } from "axios";
import { TicketType } from "../types/generated";
import { performRequestWithRetry } from "../api/retry";
import { apiUrl } from "../api/config";

export function useGetTickets() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const fetchTickets = async (
    checkIn: string,
    checkOut: string,
    guestCapacity: number,
  ): Promise<void> => {
    setLoading(true);
    const options = {
      method: "GET",
      params: {
        checkinDate: checkIn,
        checkoutDate: checkOut,
        guestCapacity
      },
    };
    try {
      const response = await performRequestWithRetry(
        `${apiUrl}/ticketTypes`,
        options
      );
      const ticketList = (response as AxiosResponse<TicketType[]>).data;
      setTickets(ticketList);
    } catch (e: any) {
      setError(e);
    }
    setLoading(false);
  };

  return { tickets, loading, error, fetchTickets };
}
