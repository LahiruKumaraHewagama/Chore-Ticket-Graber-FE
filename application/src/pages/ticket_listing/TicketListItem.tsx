import React from "react";
import { TicketType } from "../../types/generated";
import { Box, Button, Typography } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from "react-router-dom";

export default function TicketListItem(props: { ticket: TicketType }) {
  const { ticket } = props;
  const navigate = useNavigate();
  return (
    <Box
      style={{ background: "white" }}
      display="flex"
      justifyContent="space-between"
      width="100%"
      border={1}
      borderRadius={4}
      mb={1}
    >
      <Box
        width="100%"
        p={2}
        pl={4}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex=start"
      >
        <Box>
          <Typography variant="h6" color="grey">{ticket.name}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Box>
            <ConfirmationNumberIcon />
          </Box>
          <Box>
            <Typography fontSize={12}>
              {ticket.guestCapacity} 
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        width="100%"
        p={2}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>{""}</Typography>
      </Box>

      <Box
        width="100%"
        p={2}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Typography>{ticket.price}$ Price</Typography>
      </Box>

      <Box
        width="100%"
        p={2}
        pr={4}
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button className="btn primary"
          onClick={() => {
            navigate("/reservations/new", { state: { ticket } });
          }}
          style={{ textTransform: "none" }}
          variant="contained"
        >
          Book
        </Button>
      </Box>
    </Box>
  );
}
