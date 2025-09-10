import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMail, FiGithub, FiTwitter } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #1e293b;
  color: #cbd5e1;
  padding: 3rem 1rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #3b82f6;
    }
  }
`;

const BrandSection = styled.div`
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3b82f6;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #334155;
    border-radius: 50%;
    color: #cbd5e1;
    transition: all 0.2s;
    
    &:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  text-align: center;
  color: #94a3b8;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <h2>
            <FiCalendar />
            Nexo
          </h2>
          <p>
            Discover amazing local events and experiences in your area. Connect with 
            like-minded people and create unforgettable memories.
          </p>
          <SocialLinks>
            <a href="mailto:hello@nexo.com" aria-label="Email">
              <FiMail />
            </a>
            <a href="https://github.com" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FiTwitter />
            </a>
          </SocialLinks>
        </BrandSection>

        <FooterSection>
          <h3>Platform</h3>
          <ul>
            <li><Link to="/events">Browse Events</Link></li>
            <li><Link to="/create-event">Create Event</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Categories</h3>
          <ul>
            <li><Link to="/events?category=technology">Technology</Link></li>
            <li><Link to="/events?category=music">Music</Link></li>
            <li><Link to="/events?category=sports">Sports</Link></li>
            <li><Link to="/events?category=food">Food & Drink</Link></li>
            <li><Link to="/events?category=art">Art & Culture</Link></li>
            <li><Link to="/events?category=networking">Networking</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Support</h3>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 Nexo. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
