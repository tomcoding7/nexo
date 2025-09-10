import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiShield, 
  FiCheck, 
  FiX, 
  FiEye,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
`;

const StatNumber = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: #64748b;
  font-weight: 500;
`;

const EventsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RefreshButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventCard = styled(motion.div)`
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const EventDescription = styled.p`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const HostAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const HostName = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
`;

const ApproveButton = styled(Button)`
  background: #16a34a;
  color: white;
  
  &:hover {
    background: #15803d;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const RejectButton = styled(Button)`
  background: #dc2626;
  color: white;
  
  &:hover {
    background: #b91c1c;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const ViewButton = styled(Button)`
  background: #3b82f6;
  color: white;
  
  &:hover {
    background: #2563eb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #475569;
  }
`;

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && !user.isAdmin) {
      navigate('/');
    } else {
      fetchPendingEvents();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchPendingEvents = async () => {
    try {
      const response = await axios.get('/api/events/admin/pending');
      setPendingEvents(response.data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId, action) => {
    setActionLoading(prev => ({ ...prev, [eventId]: true }));
    
    try {
      await axios.put(`/api/events/${eventId}/${action}`);
      setPendingEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const formatEventDate = (dateTime) => {
    return format(new Date(dateTime), 'MMM d, yyyy \'at\' h:mm a');
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin panel..." />;
  }

  return (
    <AdminContainer>
      <Header>
        <Title>
          <FiShield />
          Admin Panel
        </Title>
        <Subtitle>
          Manage and moderate events on the platform
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <FiCalendar />
          </StatIcon>
          <StatNumber>{pendingEvents.length}</StatNumber>
          <StatLabel>Pending Events</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <FiUser />
          </StatIcon>
          <StatNumber>0</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <FiCheck />
          </StatIcon>
          <StatNumber>0</StatNumber>
          <StatLabel>Approved Today</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <FiX />
          </StatIcon>
          <StatNumber>0</StatNumber>
          <StatLabel>Rejected Today</StatLabel>
        </StatCard>
      </StatsGrid>

      <EventsSection>
        <SectionHeader>
          <SectionTitle>
            <FiCalendar />
            Pending Event Approvals
          </SectionTitle>
          <RefreshButton onClick={fetchPendingEvents}>
            Refresh
          </RefreshButton>
        </SectionHeader>

        {pendingEvents.length > 0 ? (
          <EventsList>
            {pendingEvents.map((event, index) => (
              <EventCard
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventHeader>
                  <div>
                    <EventTitle>{event.title}</EventTitle>
                    <EventMeta>
                      <MetaItem>
                        <FiClock />
                        {formatEventDate(event.dateTime)}
                      </MetaItem>
                      <MetaItem>
                        <FiMapPin />
                        {event.location.city}, {event.location.state}
                      </MetaItem>
                      <MetaItem>
                        <FiUsers />
                        {event.rsvps?.length || 0} RSVPs
                      </MetaItem>
                    </EventMeta>
                  </div>
                </EventHeader>

                <EventDescription>{event.description}</EventDescription>

                {event.host && (
                  <HostInfo>
                    <HostAvatar>
                      {event.host.name?.charAt(0)?.toUpperCase() || 'H'}
                    </HostAvatar>
                    <HostName>{event.host.name}</HostName>
                  </HostInfo>
                )}

                <ActionButtons>
                  <ApproveButton
                    onClick={() => handleEventAction(event._id, 'approve')}
                    disabled={actionLoading[event._id]}
                  >
                    <FiCheck />
                    {actionLoading[event._id] ? 'Approving...' : 'Approve'}
                  </ApproveButton>
                  
                  <RejectButton
                    onClick={() => handleEventAction(event._id, 'reject')}
                    disabled={actionLoading[event._id]}
                  >
                    <FiX />
                    {actionLoading[event._id] ? 'Rejecting...' : 'Reject'}
                  </RejectButton>
                  
                  <ViewButton onClick={() => navigate(`/events/${event._id}`)}>
                    <FiEye />
                    View Details
                  </ViewButton>
                </ActionButtons>
              </EventCard>
            ))}
          </EventsList>
        ) : (
          <EmptyState>
            <h3>No pending events</h3>
            <p>All events have been reviewed. Check back later for new submissions.</p>
          </EmptyState>
        )}
      </EventsSection>
    </AdminContainer>
  );
};

export default AdminPanel;
