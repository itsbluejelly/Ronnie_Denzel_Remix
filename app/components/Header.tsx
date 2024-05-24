// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import { NavLink } from "@remix-run/react"

// A HEADER COMPONENT FOR THE APPLICATION
export default function Header(){
    return(
        <header>
            <nav id="main-navigation">
                <ul>
                    <li className="nav-item">
                        <NavLink to='/'>Home</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to='/notes'>My notes</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}