import { BasicUserInfo, Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { default as authConfig } from "../../config.json"
import { DefaultLayout } from "../../layout/default";
import { ReservationListing } from "../../components";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../../constants/errors";
import TicketListing from "../ticket_listing";
import { AppBar } from "@mui/material";
import Header from "../../layout/AppBar";

interface DerivedState {
    authenticateResponse: BasicUserInfo,
    idToken: string[],
    decodedIdTokenHeader: string,
    decodedIDTokenPayload: Record<string, string | number | boolean>;
}

/**
 * Landing page for the Sample.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LandingPage: FunctionComponent = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [derivedAuthenticationState, setDerivedAuthenticationState] = useState<DerivedState>();
    const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState<boolean>(false);
    const [hasLogoutFailureError, setHasLogoutFailureError] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {

        if (!state?.isAuthenticated) {
            return;
        }

        (async (): Promise<void> => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState: DerivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            sessionStorage.setItem("userInfo", JSON.stringify({
                email: derivedState.decodedIDTokenPayload.username,
                id: derivedState.decodedIDTokenPayload.sub,
                name: derivedState.decodedIDTokenPayload.username,
                mobileNumber: derivedState.decodedIDTokenPayload.phone,
            }));

            setDerivedAuthenticationState(derivedState);
        })();
    }, [state.isAuthenticated, getBasicUserInfo, getIDToken, getDecodedIDToken]);

    useEffect(() => {
        if (stateParam && errorDescParam) {
            if (errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    }, [signIn]);

    /**
      * handles the error occurs when the logout consent page is enabled
      * and the user clicks 'NO' at the logout consent page
      */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
            sessionStorage.removeItem("userInfo");
        });

        on(Hooks.SignOutFailed, () => {
            if (!errorDescParam) {
                handleLogin();
            }
        })
    }, [on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
        sessionStorage.removeItem("userInfo");
    };

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={state.isLoading}
            hasErrors={hasAuthenticationErrors}
        >
            {state.isAuthenticated
                ? (
                    <div className="content"
                    >
                        <h1 style={{ fontSize: "50px", fontWeight: "bold", color: "black", margin: "0px" }}>Welcome for Ticket Grabber</h1>
                        <h3 style={{ fontSize: "25px" }}>Your Journey Begins Here: Fast, Easy, and Secure Ticket Booking</h3>
                        <TicketListing />
                    </div>
                )
                : (
                    <div>
                        <h1 style={{ fontSize: "100px", fontWeight: "bold", color: "black", margin: "0px" }}>Ticket Grabber</h1>
                        <h3 style={{ fontSize: "25px" }}>Book Your Experience, Secure Your Seat!</h3>
                        
                        <h4 style={{ margin: "0px" }}> Welcome to our one-stop destination for all your entertainment needs. </h4>
                        <h4 style={{ margin: "0px" }}>Explore a world of captivating experiences as you browse through an array of tickets for musical events, dramas, movies, and thrilling sports. </h4>
                        <h4 style={{ margin: "0px" }}>With our user-friendly interface and secure booking system, securing your tickets has never been easier. Start your journey to unforgettable moments today!</h4>
                    
                        <button
                            className="btn primary" style={{ marginTop: "20px",marginBottom: "100px"  }}
                            onClick={() => {
                                handleLogin();
                            }}
                        >
                            Starting
                        </button>
                    
                    </div>

                )
            }
        </DefaultLayout>
    );
};
