
import { BasicUserInfo } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useContext, useEffect  } from "react";
import { Reservation } from "../types/generated";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetReservations } from "../hooks/reservations";
import ReservationListItem from "../pages/reservation_listing/ReservationListItem";
import { UserContext } from "../contexts/user";
import { toast } from "react-toastify";

/**
 * Decoded ID Token Response component Prop types interface.
 */
interface ReservationListingPropsInterface {
    /**
     * Derived Authenticated Response.
     */
    derivedResponse?: any;
    handleLogout?: any;
}

export interface DerivedReservationListingInterface {
    /**
     * Response from the `getBasicUserInfo()` function from the SDK context.
     */
    authenticateResponse: BasicUserInfo;
    /**
     * ID token split by `.`.
     */
    idToken: string[];
    /**
     * Decoded Header of the ID Token.
     */
    decodedIdTokenHeader: Record<string, unknown>;
    /**
     * Decoded Payload of the ID Token.
     */
    decodedIDTokenPayload: Record<string, unknown>;
}

/**
 * Displays the derived Authentication Response from the SDK.
 *
 * @param {ReservationListingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ReservationListing: FunctionComponent<ReservationListingPropsInterface> = (
    props: ReservationListingPropsInterface
): ReactElement => {

    const {
        derivedResponse,
        handleLogout
    } = props;

    const user = JSON.parse(sessionStorage.getItem("userInfo")|| '{}');
  const { fetchReservations, reservations, loading, error } =
    useGetReservations();

  useEffect(() => {
    fetchReservations(user?.id);
  }, []);

  useEffect(() => {
    if (!!error) {
      toast.error(error.message);
    }
  }, [error]);

    return (
        <div style={{margin:"0px", width: "100%" ,alignItems:"center"}}>
               

      <Box style={{ paddingLeft:"1px" }} px={0} py={4}>
    
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
            <div  style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <p style={{ fontSize: "50px", fontWeight: "bold", color: "black", marginTop: "15px" }}>My Ticket Bookings</p>
            <div className="vertical-line"></div>
            <ReservationListItem
              reservation={reservation}
              key={reservation.id}
              fetchReservations={fetchReservations}
            />
            </div>
          ))}
        {!reservations ||
          (reservations.length === 0 && (
            <Typography variant="h4" color="white" align="center">
              No Result
            </Typography>
          ))}
      </Box>
    </div>
    );
};
