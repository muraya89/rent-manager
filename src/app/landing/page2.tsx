import { Metadata } from "next";
import Hero from "./components/Hero";

export const metadata: Metadata = {
  title: `Welcome - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Vendor portal for tender management and pre-qualification",
};

const LandingPage = async () => {
    return <div className="bg-white">
      <Hero />
  </div>;
};

export default LandingPage;
