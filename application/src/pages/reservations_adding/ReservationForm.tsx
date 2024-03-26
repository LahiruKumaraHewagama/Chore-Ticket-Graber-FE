import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useReserveTicket } from "../../hooks/reservations";
import { useLocation, useNavigate } from "react-router-dom";
import { TicketType } from "../../types/generated";
import { Location } from "history";
import { UserContext } from "../../contexts/user";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/utils";

interface TicketState {
  ticket: TicketType;
}

const ReservationForm = () => {
  const { reservation, loading, error, reserveTicket } = useReserveTicket();

  // Retrieve the user information from session storage
  var userInfoString = sessionStorage.getItem("userInfo");

  // Ensure userInfoString is not null before parsing
  if (userInfoString !== null) {
      // Convert the JSON string back to an object
      var userInfo = JSON.parse(userInfoString);

      // Now you can access individual properties of the userInfo object
      var email = userInfo.email;
      var id = userInfo.id;
      var name = userInfo.name;
      var mobileNumber = userInfo.mobileNumber;

  } else {
      console.error("User info not found in session storage.");
  }

  const {
    state: { ticket },
  } = useLocation() as Location<TicketState>;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailAddress: "",
  });
  const [checkIn, setCheckIn] = React.useState<Date>(new Date());
  const [checkOut, setCheckOut] = React.useState<Date>(new Date());
  const [maxCheckInDate, setMaxCheckInDate] = React.useState<
    string | undefined
  >(undefined);

  const handleCheckInChange = (e: any) => {
    const { value } = e.target;
    const checkInDate = new Date(value);
    setCheckIn(checkInDate);
    if (checkOut < checkInDate) setCheckOut(checkInDate);
  };

  const handleCheckOutChange = (e: any) => {
    const { value } = e.target;
    const checkOutDate = new Date(value);
    setCheckOut(checkOutDate);
    setMaxCheckInDate(formatDate(checkOutDate));
  };

  const handleTextChange = (name: string) => (e: any) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReserve = async () => {
    const {
      firstName,
      lastName,
      mobileNumber,
      emailAddress,
    } = formData;
    console.log("formData", formData);

    await reserveTicket({
      checkinDate: checkIn.toISOString(),
      checkoutDate: checkOut.toISOString(),
      rate: 100,
      ticketType: ticket.name,
      user: {
        email: emailAddress,
        id: id,
        mobileNumber,
        name: `${firstName} ${lastName}`,
      },
    });

    if (error) {
      return;
    }
    toast.success("Your ticket is ordered!");
    navigate("/reservations", { state: { reservation } });
  };

  return (
    <Box
      style={{ background: "white" }}
      display="flex"
      flexDirection="column"
      py={4}
      px={8}
    >
      <Typography variant="h4" gutterBottom>
        Book Ticket
      </Typography>
      <Typography variant="body1" gutterBottom>
      Book Your Experience, Secure Your Seat!
      </Typography>
      <Box
        mt={3}
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box width="48%">
          <TextField
            onChange={handleTextChange("firstName")}
            fullWidth
            label="First Name"
            variant="outlined"
          />
        </Box>
        <Box width="48%">
          <TextField
            onChange={handleTextChange("lastName")}
            fullWidth
            label="Last Name"
            variant="outlined"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <TextField
          onChange={handleTextChange("mobileNumber")}
          fullWidth
          label="Mobile Number"
          variant="outlined"
        />
      </Box>
      <Box mb={2}>
        <TextField
          onChange={handleTextChange("emailAddress")}
          fullWidth
          label="Email Address"
          variant="outlined"
        />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box width="48%">
          <TextField
            onChange={handleCheckInChange}
            fullWidth
            label="Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formatDate(checkIn)}
            inputProps={{
              min: formatDate(new Date()),
              max: maxCheckInDate,
            }}
          />
        </Box>
        <Box width="48%" style={{display:"none"}}>
          <TextField
            onChange={handleCheckOutChange}
            fullWidth
            label="Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formatDate(checkOut)}
            inputProps={{ min: formatDate(checkIn) }}
          />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          style={{ textTransform: "none" }}
          onClick={() => navigate("/tickets")}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "8px", textTransform: "none" }}
          onClick={handleReserve}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : "Buy"}
        </Button>
      </Box>
    </Box>
  );
};

export default ReservationForm;
