import Link from 'next/link';
import Image from 'next/image';
import logo from "../public/logo.png";
export default function Header() {
  return (
    <header>
      <div class="row">
      <nav className="navbar navbar-dark bg-primary col-12">
        <div className="container-fluid">
          <Link className="navbar-brand" href={"/"}>
            <Image src={logo} alt="Logo" width={40} className="d-inline-block align-text-top" />
            &nbsp;Team11
          </Link>
        </div>
      </nav>
      </div>
    </header>
  )
}