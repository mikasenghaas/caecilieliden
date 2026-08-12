import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col gap-1.5 text-xs sm:text-sm leading-relaxed">
      <Link
        href="mailto:caeciliebode@gmail.com"
        className="w-fit transition-colors duration-200 ease-out hover:text-[#ED2E85]"
      >
        Email
      </Link>
      <Link
        href="https://www.linkedin.com/in/c%C3%A6cilie-lid%C3%A9n-bode-8745a025a/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit transition-colors duration-200 ease-out hover:text-[#ED2E85]"
      >
        LinkedIn
      </Link>
      <Link
        href="https://pin.it/7Jg9C1reP"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit transition-colors duration-200 ease-out hover:text-[#ED2E85]"
      >
        Pinterest
      </Link>
      <Link
        href="https://www.instagram.com/caecilieliden/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit transition-colors duration-200 ease-out hover:text-[#ED2E85]"
      >
        Instagram
      </Link>
      <Link
        href="https://x.com/caecilieliden"
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit transition-colors duration-200 ease-out hover:text-[#ED2E85]"
      >
        Twitter
      </Link>
    </div>
  );
}
