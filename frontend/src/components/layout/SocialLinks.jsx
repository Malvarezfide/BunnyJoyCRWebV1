import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import site from "../../config/site";

function SocialLinks({ mobile = false }) {
  const classes = mobile
    ? "flex items-center gap-3 py-2"
    : "flex items-center gap-4";

  return (
    <div className={classes}>
      <a
        href={site.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:scale-110 transition"
      >
        <FaFacebook size={26} />
      </a>

      <a
        href={`https://wa.me/${site.phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 hover:scale-110 transition"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
}

export default SocialLinks;