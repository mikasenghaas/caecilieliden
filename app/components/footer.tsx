import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <Link
          href="mailto:caeciliebode@gmail.com"
          aria-label="Email"
        >
          <Image src="/email.svg" alt="Email" width={32} height={32} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/c%C3%A6cilie-lid%C3%A9n-bode-8745a025a/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Image src="/linkedin.svg" alt="LinkedIn" width={32} height={32} />
        </Link>
        <Link
          href="https://pin.it/7Jg9C1reP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pinterest"
        >
          <Image src="/pinterest.svg" alt="Pinterest" width={32} height={32} />
        </Link>
      </div>
      <p className="text-sm">
        © {currentYear} Caecilie Lidèn Bode
      </p>
    </footer>
  );
}
