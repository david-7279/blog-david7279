"use client";

import Logo from "@/components/nav/logo";
import NavBarWrapper from "@/components/nav/nav-bar-wrapper";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  return (
    <NavBarWrapper>
      <Logo />
      <ThemeToggle />
    </NavBarWrapper>
  );
};

export default Header;
