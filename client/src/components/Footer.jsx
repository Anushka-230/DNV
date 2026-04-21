import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

      <div>
        <h3 className="text-white font-semibold mb-3">DNV</h3>
        <p className="text-sm leading-relaxed">
          School Website for Debagram Netaji Vidyalaya (DNV)
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/"        className="hover:text-white transition">Home</Link></li>
          <li><Link to="/about"   className="hover:text-white transition">About</Link></li>
          <li><Link to="/gallery" className="hover:text-white transition">Gallery</Link></li>
          <li><Link to="/login"   className="hover:text-white transition">Sign In</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Contact</h3>
        <ul className="space-y-2 text-sm">
          <li>Debagram,Gangnapur,Nadia</li>
          <li> +91 95643 89142</li>
          <li> info@dnv.edu.in</li>
        </ul>
      </div>

    </div>
    <div className="text-center text-xs mt-8 text-gray-600">
      © {new Date().getFullYear()} DNV. All rights reserved.
    </div>
  </footer>
);

export default Footer;