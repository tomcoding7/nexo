import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiAward, 
  FiMapPin, 
  FiClock,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, #FF385C 0%, #E31C5F 50%, #FF6B8A 100%);
  color: white;
  border-radius: 24px;
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.2;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.375rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  line-height: 1.5;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: white;
  color: #FF385C;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: #f8f8f8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF385C, #E31C5F);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const StatNumber = styled.h3`
  font-size: 2.25rem;
  font-weight: 800;
  color: #222222;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const StatLabel = styled.p`
  color: #717171;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewAllLink = styled(Link)`
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #2563eb;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #475569;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRSVPs: 0,
    activeHosts: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, upcomingRes] = await Promise.all([
          axios.get('/api/events?trending=true&limit=6'),
          axios.get('/api/events?limit=6')
        ]);

        setTrendingEvents(trendingRes.data);
        setUpcomingEvents(upcomingRes.data);

        // Realistic stats for demo
        setStats({
          totalEvents: 1247,
          totalUsers: 3421,
          totalRSVPs: 8934,
          activeHosts: 156
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading events..." />;
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find your next adventure</HeroTitle>
          <HeroSubtitle>
            Discover unique experiences, connect with like-minded people, and create 
            unforgettable memories. From tech meetups to art galleries, find events that inspire you.
          </HeroSubtitle>
          <CTAButtons>
            <PrimaryButton to="/events">
              <FiCalendar />
              Browse Events
            </PrimaryButton>
            {!isAuthenticated && (
              <SecondaryButton to="/register">
                Join Now
              </SecondaryButton>
            )}
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <FiCalendar />
          </StatIcon>
          <StatNumber>{stats.totalEvents.toLocaleString()}</StatNumber>
          <StatLabel>Events Created</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <FiUsers />
          </StatIcon>
          <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
          <StatLabel>Active Users</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <FiAward />
          </StatIcon>
          <StatNumber>{stats.totalRSVPs.toLocaleString()}</StatNumber>
          <StatLabel>RSVPs</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <FiStar />
          </StatIcon>
          <StatNumber>{stats.activeHosts}</StatNumber>
          <StatLabel>Active Hosts</StatLabel>
        </StatCard>
      </StatsSection>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiTrendingUp />
            Trending Events
          </SectionTitle>
          <ViewAllLink to="/events?trending=true">
            View All
          </ViewAllLink>
        </SectionHeader>
        
        {trendingEvents.length > 0 ? (
          <EventsGrid>
            {trendingEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </EventsGrid>
        ) : (
          <EmptyState>
            <h3>No trending events yet</h3>
            <p>Be the first to create an amazing event!</p>
            {isAuthenticated && (
              <PrimaryButton to="/create-event">
                <FiCalendar />
                Create Event
              </PrimaryButton>
            )}
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiClock />
            Upcoming Events
          </SectionTitle>
          <ViewAllLink to="/events">
            View All
          </ViewAllLink>
        </SectionHeader>
        
        {upcomingEvents.length > 0 ? (
          <EventsGrid>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 6) * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </EventsGrid>
        ) : (
          <EmptyState>
            <h3>No upcoming events</h3>
            <p>Check back soon for new events in your area!</p>
          </EmptyState>
        )}
      </Section>
    </HomeContainer>
  );
};

export default Home;
