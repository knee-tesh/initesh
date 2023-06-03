import Image from "next/image";

const Hero = () => {
    return (
        <div className="hero-container">
            <Image
                src="/images/me.jpeg"
                className="profile-img"
                width={300}
                height={300}
                alt="Nitesh Tiwari"
            />
            <div className="hero-text">
                <h1>Hey, I'm Nitesh Tiwari 👋</h1>
                <p>
                    I'm a fullstack developer based in Pune, India. I specialize in building exceptional websites,
                    applications, and everything in between.
                </p>
                <div className="social-icons">
                    {/* <a
                        href="https://twitter.com/knee_tesh"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-twitter"></i>
                    </a> */}
                    <a
                        href="https://github.com/knee-tesh"
                        aria-label="GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/nitesh-tiwari-32635b152"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
