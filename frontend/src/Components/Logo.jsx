import assets from "../assets/assets/";

const Logo = ({ width }) => {
    return (
        <div className="flex gap-2">
            <img
                src={assets.logo}
                alt="logo"
                className={`max-w-${width} max-w-6`}
            />
            <span className="font-orbitron tracking-widest font-bold ">
                Chattr
            </span>
        </div>
    );
};

export default Logo;
