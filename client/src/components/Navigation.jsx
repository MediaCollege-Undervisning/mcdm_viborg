import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import {
  MainBurgerMenu,
  MainNav,
  MainNavContainer,
  MainNavWrapper,
  MainStyledNavLink,
  DropdownContainer,
  DropdownContent,
  DropdownToggle,
  StyledExternalLink,
} from "../styles/navigationStyles";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { user } = useAuthContext();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const toggleDropdown = (menu) =>
    setDropdownOpen(dropdownOpen === menu ? null : menu);

  return (
    <MainNav>
      <MainNavWrapper>
        <MainBurgerMenu onClick={toggleMenu} $menuOpen={menuOpen}>
          <span />
          <span />
          <span />
        </MainBurgerMenu>

        <MainNavContainer $menuOpen={menuOpen}>
          {/* Projekter */}
          <MainStyledNavLink to='/projects' onClick={closeMenu}>
            Projekter
          </MainStyledNavLink>

          {/* Dropdown - Ressourcer */}
          <DropdownContainer>
            <DropdownToggle onClick={() => toggleDropdown("resources")}>
              Ressourcer ▼
            </DropdownToggle>
            {dropdownOpen === "resources" && (
              <DropdownContent onClick={() => toggleDropdown("")}>
                <MainStyledNavLink to='/exercises' onClick={closeMenu}>
                  Opgaver
                </MainStyledNavLink>
                <MainStyledNavLink to='/materials' onClick={closeMenu}>
                  Materialer
                </MainStyledNavLink>
                <MainStyledNavLink to='/faqs' onClick={closeMenu}>
                  FAQ
                </MainStyledNavLink>
                <MainStyledNavLink to='/register' onClick={closeMenu}>
                  Stikordsregister
                </MainStyledNavLink>
              </DropdownContent>
            )}
          </DropdownContainer>

          {/* Dropdown - Eksamen */}
          <DropdownContainer>
            <DropdownToggle onClick={() => toggleDropdown("exam")}>
              Eksamen ▼
            </DropdownToggle>
            {dropdownOpen === "exam" && (
              <DropdownContent onClick={() => toggleDropdown("")}>
                <StyledExternalLink
                  onClick={closeMenu}
                  href='/assets/pdf/Eksamensforberedelse.pdf'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Eksamensforberedelse
                </StyledExternalLink>
                <MainStyledNavLink to='/examproject' onClick={closeMenu}>
                  Eksamensprojektet
                </MainStyledNavLink>
                <StyledExternalLink
                  onClick={closeMenu}
                  href='/assets/pdf/Eksamensinfo.pdf'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Eksamen
                </StyledExternalLink>

                <StyledExternalLink
                  onClick={closeMenu}
                  href='/assets/pdf/Tjekliste_eksamen_webudvikler.pdf'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Tjekliste
                </StyledExternalLink>
                <StyledExternalLink
                  onClick={closeMenu}
                  href='/assets/pdf/Vurderingsskemaer_Tabel_Webudvikler.pdf'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Karakterskala
                </StyledExternalLink>
              </DropdownContent>
            )}
          </DropdownContainer>

          <MainStyledNavLink to='/events' onClick={closeMenu}>
            Vigtige datoer
          </MainStyledNavLink>
          {/* Profiler og Backoffice */}
          {user.role === "student" && (
            <MainStyledNavLink
              to={`/studentpanel/${user._id}`}
              onClick={closeMenu}>
              Min profil
            </MainStyledNavLink>
          )}

          {user.role === "teacher" && (
            <MainStyledNavLink
              to={`/teacherpanel/${user._id}`}
              onClick={closeMenu}>
              Min profil
            </MainStyledNavLink>
          )}

          {(user.role === "teacher" || user.role === "admin") && (
            <MainStyledNavLink to='/backoffice' onClick={closeMenu}>
              Backoffice
            </MainStyledNavLink>
          )}
        </MainNavContainer>
      </MainNavWrapper>
    </MainNav>
  );
};

export default Navigation;
