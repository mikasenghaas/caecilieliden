import Link from "next/link";
import Image from "next/image";
import emailSvg from "@/app/assets/email.svg";
import linkedinSvg from "@/app/assets/linkedin.svg";
import pinterestSvg from "@/app/assets/pinterest.svg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <Link
          href="mailto:caeciliebode@gmail.com"
          aria-label="Email"
        >
          <Image src={emailSvg} alt="Email" width={32} height={32} unoptimized />
        </Link>
        <Link
          href="https://www.linkedin.com/in/c%C3%A6cilie-lid%C3%A9n-bode-8745a025a/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Image src={linkedinSvg} alt="LinkedIn" width={32} height={32} unoptimized />
        </Link>
        <Link
          href="https://pin.it/7Jg9C1reP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pinterest"
        >
          <Image src={pinterestSvg} alt="Pinterest" width={32} height={32} unoptimized />
        </Link>
      </div>
      <p className="text-sm">
        © {currentYear} Caecilie Lidèn Bode
      </p>
    </footer>
  );
}
