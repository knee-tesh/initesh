import Link from "next/link";

const Navbar = () => {
    return (
        <div className="nav-container">
            <div className="logo">
                <Link href="/">Nitesh Tiwari</Link>
            </div>
            <a
                href="https://docs.google.com/file/d/1dBR__598JhqIW752nJr0A5_VqXZilBfB/view?usp=drivesdk"
                target="_blank"
                className="cta-btn"
            >
                Resume
            </a>
        </div>
    );
};

export default Navbar;
