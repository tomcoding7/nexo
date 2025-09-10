import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiPlus,
  FiAward,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 0 2rem;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #FF385C;
  text-decoration: none;
  letter-spacing: -0.02em;
  
  &:hover {
    color: #E31C5F;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #222222;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 22px;
  
  &:hover {
    color: #FF385C;
    background-color: rgba(255, 56, 92, 0.08);
  }
  
  &.active {
    color: #FF385C;
    background-color: rgba(255, 56, 92, 0.12);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 21px;
  color: #222222;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-color: #b0b0b0;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF385C, #E31C5F);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #475569;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const PrimaryButton = styled(Button)`
  background: #FF385C;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: #E31C5F;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #222222;
  border: 1px solid #dddddd;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: #f7f7f7;
    border-color: #b0b0b0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  padding: 0.5rem;
  color: #64748b;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #64748b;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: #3b82f6;
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <FiCalendar />
          Nexo
        </Logo>

        <NavLinks>
          <NavLink to="/events" className={isActive('/events') ? 'active' : ''}>
            Events
          </NavLink>
          <NavLink to="/leaderboard" className={isActive('/leaderboard') ? 'active' : ''}>
            <FiAward />
            Leaderboard
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/create-event" className={isActive('/create-event') ? 'active' : ''}>
              <FiPlus />
              Create Event
            </NavLink>
          )}
        </NavLinks>

        <UserSection>
          {isAuthenticated ? (
            <>
              <UserMenu>
                <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                  <UserAvatar>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </UserAvatar>
                  {user?.name}
                </UserButton>
                
                {showUserMenu && (
                  <Dropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem to="/profile" onClick={() => setShowUserMenu(false)}>
                      <FiUser />
                      Profile
                    </DropdownItem>
                    {user?.isAdmin && (
                      <DropdownItem to="/admin" onClick={() => setShowUserMenu(false)}>
                        <FiSettings />
                        Admin Panel
                      </DropdownItem>
                    )}
                    <DropdownItem as="button" onClick={handleLogout}>
                      <FiLogOut />
                      Logout
                    </DropdownItem>
                  </Dropdown>
                )}
              </UserMenu>
            </>
          ) : (
            <AuthButtons>
              <SecondaryButton as={Link} to="/login">
                Login
              </SecondaryButton>
              <PrimaryButton as={Link} to="/register">
                Sign Up
              </PrimaryButton>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </UserSection>
      </NavContainer>

      {showMobileMenu && (
        <MobileMenu
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MobileNavLink to="/events" onClick={() => setShowMobileMenu(false)}>
            <FiCalendar />
            Events
          </MobileNavLink>
          <MobileNavLink to="/leaderboard" onClick={() => setShowMobileMenu(false)}>
            <FiAward />
            Leaderboard
          </MobileNavLink>
          {isAuthenticated ? (
            <>
              <MobileNavLink to="/create-event" onClick={() => setShowMobileMenu(false)}>
                <FiPlus />
                Create Event
              </MobileNavLink>
              <MobileNavLink to="/profile" onClick={() => setShowMobileMenu(false)}>
                <FiUser />
                Profile
              </MobileNavLink>
              {user?.isAdmin && (
                <MobileNavLink to="/admin" onClick={() => setShowMobileMenu(false)}>
                  <FiSettings />
                  Admin Panel
                </MobileNavLink>
              )}
              <MobileNavLink as="button" onClick={handleLogout}>
                <FiLogOut />
                Logout
              </MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={() => setShowMobileMenu(false)}>
                Login
              </MobileNavLink>
              <MobileNavLink to="/register" onClick={() => setShowMobileMenu(false)}>
                Sign Up
              </MobileNavLink>
            </>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
