import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/utils";

interface TicketSearchProps {
  searchTickets: (checkIn: string, checkOut: string, guestCapacity: number) => void;
  loading: boolean;
  error?: Error;
}

export function TicketSearchBar(props: TicketSearchProps) {
  const { searchTickets, loading, error } = props;
  const [guestCapacity, setGuestCapacity] = React.useState(2);
  const [checkIn, setCheckIn] = React.useState<Date>(new Date());
  const [checkOut, setCheckOut] = React.useState<Date>(new Date());
  const [maxCheckInDate, setMaxCheckInDate] = React.useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!!error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleTicketTypeChange = (event: any) => {
    setGuestCapacity(event.target.value as number);
  };

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

  const handleTicketSearch = () => {
    console.log(checkIn, checkOut, guestCapacity);
    if (checkIn === null || checkOut === null) {
      return;
    }
    searchTickets(checkIn.toISOString(), checkOut.toISOString(), guestCapacity);
  };

  return (
    <div style={{alignItems:"center"}}>
    <Box
      flexDirection="row"
      border={1}
      px={1}
      py={1}
      mb={2}
      style={{ background: "rgba(0, 0, 0, 0.5)",width:"500px" }}
    >
      <Box display="flex" width="100%" justifyContent="space-between">
        <Box style={{ backgroundColor: "white" }} width="45%" borderRadius={0}>
          <TextField
            onChange={handleCheckInChange}
            fullWidth
            label="Date"
            variant="filled"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formatDate(checkIn)}
            inputProps={{
              min: formatDate(new Date()),
              max: maxCheckInDate,
            }}
          />
        </Box>
        <Box style={{ backgroundColor: "white" , display:"none"}} width="0%" borderRadius={0}>
          <TextField
          
            onChange={handleCheckOutChange}
            fullWidth
            label="Check Out Date"
            variant="filled"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formatDate(checkOut)}
            inputProps={{ min: formatDate(checkIn) }}
          />
        </Box>
        <Box style={{ backgroundColor: "white" }} width="45%">
          <TextField
            fullWidth
            label="Type"
            value={guestCapacity}
            select={true}
            onChange={handleTicketTypeChange}
            variant="filled"
          >
            <MenuItem value={1}>Musix</MenuItem>
            <MenuItem value={2}>Sport</MenuItem>
            <MenuItem value={3}>Movie</MenuItem>
            <MenuItem value={4}>Drama</MenuItem>
          </TextField>
        </Box>
      </Box>
   
    </Box>
       <Button className="btn primary"
       style={{ marginLeft:"0px" ,textTransform: "none", width: "200px"}}
       variant="contained"
       onClick={handleTicketSearch}
       disabled={
         checkIn === null || checkOut === null || loading
       }
     >
       {loading ? (
         <Typography>Waiting...</Typography>
       ) : (
         <Typography>Search</Typography>
       )}
     </Button>
     </div>
  );
}
