import { BasicUserInfo, Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { default as authConfig } from "../../config.json"
import { DefaultLayout } from "../../layout/default";
import {ReservationListing} from "../../components";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../../constants/errors";

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

    const [ derivedAuthenticationState, setDerivedAuthenticationState ] = useState<DerivedState>();
    const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

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

            sessionStorage.setItem("userInfo",JSON.stringify({
              email: derivedState.decodedIDTokenPayload.username,
              id: derivedState.decodedIDTokenPayload.sub,
              name: derivedState.decodedIDTokenPayload.username,
              mobileNumber: derivedState.decodedIDTokenPayload.phone,
            }));

            setDerivedAuthenticationState(derivedState);
        })();
    }, [ state.isAuthenticated , getBasicUserInfo, getIDToken, getDecodedIDToken ]);

    useEffect(() => {
        if(stateParam && errorDescParam) {
            if(errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    }, [ signIn ]);

   /**
     * handles the error occurs when the logout consent page is enabled
     * and the user clicks 'NO' at the logout consent page
     */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if(!errorDescParam) {
                handleLogin();
            }
        })
    }, [ on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
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
            isLoading={ state.isLoading }
            hasErrors={ hasAuthenticationErrors }
        >
            {
                state.isAuthenticated
                    ? (
                        <div className="content">
                            <ReservationListing
                                derivedResponse={ derivedAuthenticationState }
                            />
                            <button
                                className="btn primary mt-4"
                                onClick={ () => {
                                    handleLogout();
                                } }
                            >
                                Logout
                            </button>
                        </div>
                    )
                    : (
                        <div
                        style={{
                          backgroundImage: `url(${require("../../resources/hotel-room.png")}`,
                          minHeight: "100vh",
                          backgroundSize: "cover",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                         <div>
                         <button
                                className="btn primary"
                                onClick={ () => {
                                    handleLogin();
                                } }
                            >
                                Get Started
                            </button>
                        </div>
                      </div>
                    )
            }
        </DefaultLayout>
    );
};
