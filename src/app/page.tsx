import Hero from "@/components/Hero";
import About from "@/components/About";
import CoreValues from "@/components/CoreValues";
import ServicesOverview from "@/components/ServicesOverview";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ServicesOverview />
      <CoreValues />
      <Contact />
    </>
  );
}
