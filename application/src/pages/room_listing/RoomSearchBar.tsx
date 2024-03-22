import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/utils";

interface RoomSearchProps {
  searchRooms: (checkIn: string, checkOut: string, guestCapacity: number) => void;
  loading: boolean;
  error?: Error;
}

export function RoomSearchBar(props: RoomSearchProps) {
  const { searchRooms, loading, error } = props;
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

  const handleRoomTypeChange = (event: any) => {
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

  const handleRoomSearch = () => {
    console.log(checkIn, checkOut, guestCapacity);
    if (checkIn === null || checkOut === null) {
      return;
    }
    searchRooms(checkIn.toISOString(), checkOut.toISOString(), guestCapacity);
  };

  return (
    <div style={{alignItems:"center"}}>
    <Box
      flexDirection="row"
      display="flex"
      justifyContent="space-between"
      border={1}
      px={1}
      py={1}
      mb={4}
      style={{ background: "rgba(0, 0, 0, 0.5)",width:"1000px" }}
    >
      <Box display="flex" width="100%" justifyContent="space-between">
        <Box style={{ backgroundColor: "white" }} width="25%" borderRadius={0}>
          <TextField
            onChange={handleCheckInChange}
            fullWidth
            label="Check In Date"
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
        <Box style={{ backgroundColor: "white" }} width="25%" borderRadius={0}>
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
        <Box style={{ backgroundColor: "white" }} width="25%">
          <TextField
            fullWidth
            label="Guest Capacity"
            value={guestCapacity}
            select={true}
            onChange={handleRoomTypeChange}
            variant="filled"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </TextField>
        </Box>
      </Box>
   
    </Box>
       <Button className="btn primary"
       style={{ marginLeft:"300px" ,textTransform: "none", width: "200px"}}
       variant="contained"
       onClick={handleRoomSearch}
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
