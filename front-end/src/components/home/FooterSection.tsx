import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

const FooterSection = () => {
  return (
    <footer className="bg-[#0E1735] text-white mt-16">
      {/* Newsletter Section */}
      <div className="py-10 px-4 md:px-8 flex flex-col  items-center justify-center gap-4">
        <div className="font-semibold text-lg">Subscribe to Our Newsletter</div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Email"
            className="bg-white text-black"
          />
          <Button type="submit" className="hover:cursor-pointer">
            Subscribe
          </Button>
        </div>
      </div>

      {/* Social Media + Copyright */}
      <div className="py-8 text-center">
        <div className="flex justify-center gap-6 text-white text-xl mb-4">
          <Link href="https://www.facebook.com">
            <FaFacebookF />
          </Link>
          <Link href="https://www.instagram.com">
            <FaInstagram />
          </Link>
          <Link href="https://www.youtube.com">
            <FaYoutube />
          </Link>
        </div>
        <p className="text-sm text-gray-400">© Copyright 2025 - VISPA</p>
      </div>
    </footer>
  );
};

export default FooterSection;
