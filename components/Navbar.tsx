import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex justify-between bg-white p-6 shadow lg:flex-row flex-col">
      <Link
        href="/"
        className="flex lg:justify-start justify-center mb-3 self-center"
      >
        <Image
          src={"/logo.svg"}
          alt={`logo pokemon image`}
          width={150}
          height={150}
        />
      </Link>
      <Link
        href="/my-pokemon"
        className="rounded-xl bg-red-400 py-4 mt-3 self-center px-7 text-center font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20"
      >
        See My Pokemon
      </Link>
    </nav>
  );
}
