import { Reservation } from "../../types/generated";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetReservations } from "../../hooks/reservations";
import ReservationListItem from "./ReservationListItem";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user";
import { toast } from "react-toastify";

function ReservationListing() {
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
  const { fetchReservations, reservations, loading, error } =
    useGetReservations();

  useEffect(() => {
    fetchReservations(id);
  }, []);

  useEffect(() => {
    if (!!error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
      <Box  px={8} py={4}>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        )}
        {reservations &&
          reservations.map((reservation: Reservation) => (
            <ReservationListItem
              reservation={reservation}
              key={reservation.id}
              fetchReservations={fetchReservations}
            />
          ))}
        {!reservations ||
          (reservations.length === 0 && (
            <Typography variant="h4" color="white" align="center">
              No reservations found
            </Typography>
          ))}
      </Box>
    </div>
  );
}

export default ReservationListing;
