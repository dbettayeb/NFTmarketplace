import { Outlet } from "react-router";
import Navbar from "./Navbar";

const SharedLayout = () => {

    const version = "1.0.0";

    return (

        <main>

            <Navbar />

            <section className="wrapper">

                <Outlet />

            </section>

            {/* <Footer version={`version ${version}`} /> */}

        </main>

    );

};




export default SharedLayout;