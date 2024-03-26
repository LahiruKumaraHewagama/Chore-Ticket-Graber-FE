import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import { default as authConfig } from "./config.json";
import { ErrorBoundary } from "./error-boundary";
import NotFound from "./pages/not_found";
import {LandingPage} from "./pages/landing_page";
import TicketListing from "./pages/ticket_listing";
import { ReservationListing } from "./components/ReservationListing";
import ReservationAddingPage from "./pages/reservations_adding";
import ReservationUpdatingPage from "./pages/reservations_updating";
import ErrorPage from "./pages/error";
import Header from "./layout/AppBar";

const AppContent: FunctionComponent = (): ReactElement => {
    const { error } = useAuthContext();

    return (
        <ErrorBoundary error={error}>
            <div  style={{
                          backgroundImage: `url(${require("./resources/background.png")}`,
                          width: "100%",
                          minHeight:"500px"
                        }}>

            <Router >
            <Routes>
                <Route path="/" element={ <LandingPage /> } />
                <Route path="/tickets" Component={TicketListing} />
                {/* reservations */}
                <Route path="/reservations" Component={ReservationListing} />
                {/* new reservation */}
                <Route
                  path="/reservations/new"
                  Component={ReservationAddingPage}
                />
                {/* update reservation */}
                <Route
                  path="/reservations/change"
                  Component={ReservationUpdatingPage}
                />
                <Route path="/error" Component={ErrorPage} />
                {/* Otherwise, show not found page */}
                <Route path="*" Component={NotFound} />
           
                <Route element={ <NotFound /> } />
            </Routes>
        </Router>
        </div>
        </ErrorBoundary>
    )
};

const App = () => (
    <AuthProvider config={authConfig}>
        <Header/>
        <AppContent />
    </AuthProvider>
);

render((<App />), document.getElementById("root"));
