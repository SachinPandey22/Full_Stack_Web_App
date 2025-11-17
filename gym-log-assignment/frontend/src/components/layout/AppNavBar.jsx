import React, {useState} from "react";
import { Link } from "react-router-dom";
import SidePanelMenu from "./SidePanelMenu/SidePanelMenu";
import { useAuth } from "../../context/AuthContext";

const DarkPrimaryBlue = "#0337c8ff";
const LightPrimaryBlue = "#007bff";

export default function AppNavBar({ rightContent }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

     const closeMenu = () => setIsMenuOpen(false);

     const { profile } = useAuth();   

      const menuItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "My Workouts", to: "/my-workouts" },
    { label: "Nutrition", to: "/nutrition" },
    { label: "Workout Library", to: "/workout-library" },
    { label: "Profile", to: "/profile" },
    // add more routes here if you want
    ];

  return (
    <>
    <nav
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "20px 20px",
        background: DarkPrimaryBlue,
        color: "#ffffff",
      }}
    >

        {/* LEFT: hamburger + optional leftContent */}
      <div
        style={{
          justifySelf: "start",
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative", // so the dropdown anchors here
        }}
      >
        {/* Hamburger button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Open navigation menu"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.4)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {/* Three-line icon */}
          <span
            style={{
              width: 18,
              height: 2,
              borderRadius: 9999,
              background: "#ffffff",
              position: "relative",
              boxShadow: "0 6px 0 #ffffff, 0 -6px 0 #ffffff",
            }}
          />
        </button>

        <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
              color: '#ffffff',
            }}
          >
        
        {/* Profile Goal */}
        {profile?.goal && (
          <p style={{ marginLeft: '290px', color: '#ffffffff' }}>
            Goal: {profile.goal}
          </p>
        )}
        </div>

      
      </div>

      {/* CENTER: logo, always dead center */}
      <Link
        to="/dashboard"
        style={{
          justifySelf: "center",
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <img
          src="/ai_fitness_with_text.png"
          alt="SHAKTIMAN"
          style={{ height: 60, width: "auto", display: "block" }}
        />
      </Link>

      {/* RIGHT */}
      <div
        style={{
          justifySelf: "end",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {rightContent}
      </div>
    </nav>

    {/* Side panel lives in its own component now */}
      <SidePanelMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        menuItems={menuItems}
      />
     
    </>
  );
}
