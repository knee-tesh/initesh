import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Education from "@/components/Education";

import Head from "next/head";

const Home = () => {
    return (
        <>
            <Head>
                <title>Nitesh Tiwari</title>
                <meta name="description" content="Nitesh Tiwari" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Education />
                <Contact />
            </div>
        </>
    );
};

export default Home;
