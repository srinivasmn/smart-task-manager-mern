import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link> |{" "}
      <Link href="/dashboard">Dashboard</Link> |{" "}
      <Link href="/user">User</Link> |{" "}
      <Link href="/login">Login</Link>
    </nav>
  );
}
