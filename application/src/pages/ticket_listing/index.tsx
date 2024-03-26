import React from "react";
import { useGetTickets } from "../../hooks/tickets";
import { TicketType } from "../../types/generated";
import { TicketSearchBar } from "./TicketSearchBar";
import TicketListItem from "./TicketListItem";
import { Box, Typography } from "@mui/material";

function TicketListing() {
  const { fetchTickets, tickets: ticketList, loading, error } = useGetTickets();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
      <TicketSearchBar searchTickets={fetchTickets} error={error} loading={loading} />
      {ticketList &&
          ticketList.map((ticket: TicketType) => (
      <Box style={{ background: "rgba(0, 0, 0, 0.5)" , marginLeft:"300px",marginTop:"50px"}} px={1} py={1}> 
      <TicketListItem ticket={ticket} key={ticket.id} />             
      </Box>
       ))}
    </div>
  );
}

export default TicketListing;
