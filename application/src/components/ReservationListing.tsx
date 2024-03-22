
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
        <div style={{margin:"1000px", width: "100%" ,alignItems:"center"}}>
      <Box style={{ padding:"100px" }} px={8} py={4}>
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
              No Result
            </Typography>
          ))}
      </Box>
    </div>
    );
};
