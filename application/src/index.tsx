import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import { default as authConfig } from "./config.json";
import { ErrorBoundary } from "./error-boundary";
import NotFound from "./pages/not_found";
import {LandingPage} from "./pages/landing_page";

const AppContent: FunctionComponent = (): ReactElement => {
    const { error } = useAuthContext();

    return (
        <ErrorBoundary error={error}>
            <Router>
            <Routes>
                <Route path="/" element={ <LandingPage /> } />
                <Route element={ <NotFound /> } />
            </Routes>
        </Router>
        </ErrorBoundary>
    )
};

const App = () => (
    <AuthProvider config={authConfig}>
        <AppContent />
    </AuthProvider>
);

render((<App />), document.getElementById("root"));
