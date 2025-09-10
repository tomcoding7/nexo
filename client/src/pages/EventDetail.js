import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiStar,
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiMessageCircle
} from 'react-icons/fi';
import { format, isToday, isTomorrow } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: color 0.2s;
  
  &:hover {
    color: #3b82f6;
  }
`;

const EventHeader = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const EventImage = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  position: relative;
  overflow: hidden;
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const EventTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const EventMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 1rem;
`;

const EventDescription = styled.div`
  color: #374151;
  line-height: 1.7;
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  text-decoration: none;
`;

const PrimaryButton = styled(Button)`
  background: #3b82f6;
  color: white;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
  
  &:hover {
    background: #f8fafc;
    color: #3b82f6;
    border-color: #3b82f6;
  }
`;

const HostSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const HostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const HostAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
`;

const HostInfo = styled.div`
  flex: 1;
`;

const HostName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const HostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const HostBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Badge = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AttendeesSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AttendeesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const AttendeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const AttendeeAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const AttendeeName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const getCategoryIcon = (category) => {
  const icons = {
    technology: '💻',
    music: '🎵',
    sports: '⚽',
    food: '🍕',
    art: '🎨',
    education: '📚',
    networking: '🤝',
    fitness: '💪',
    gaming: '🎮',
    outdoor: '🌲'
  };
  return icons[category] || '📅';
};

const formatEventDate = (dateTime) => {
  const date = new Date(dateTime);
  
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
  }
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [userRSVP, setUserRSVP] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
      
      if (isAuthenticated && user) {
        const rsvp = response.data.rsvps?.find(rsvp => rsvp.user._id === user.id);
        setUserRSVP(rsvp?.status || null);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRsvpLoading(true);
    try {
      if (userRSVP) {
        // Remove existing RSVP
        await axios.delete(`/api/events/${id}/rsvp`);
        setUserRSVP(null);
      } else {
        // Add new RSVP
        await axios.post(`/api/events/${id}/rsvp`, { status });
        setUserRSVP(status);
      }
      
      // Refresh event data
      await fetchEvent();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <EventDetailContainer>
        <EmptyState>
          <h3>Event not found</h3>
          <p>The event you're looking for doesn't exist or has been removed.</p>
        </EmptyState>
      </EventDetailContainer>
    );
  }

  const categoryIcon = getCategoryIcon(event.category);
  const formattedDate = formatEventDate(event.dateTime);
  const attendingCount = event.rsvps?.filter(rsvp => rsvp.status === 'attending').length || 0;
  const attendees = event.rsvps?.filter(rsvp => rsvp.status === 'attending').slice(0, 6) || [];

  return (
    <EventDetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft />
        Back to Events
      </BackButton>

      <EventHeader>
        <EventImage>
          {event.image ? (
            <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: '4rem' }}>{categoryIcon}</div>
          )}
          <CategoryBadge>{event.category}</CategoryBadge>
        </EventImage>

        <EventTitle>{event.title}</EventTitle>

        <EventMeta>
          <MetaItem>
            <FiClock />
            {formattedDate}
          </MetaItem>
          <MetaItem>
            <FiMapPin />
            {event.location.name}, {event.location.city}
          </MetaItem>
          <MetaItem>
            <FiUsers />
            {attendingCount} attending
            {event.maxAttendees && ` (${event.maxAttendees} max)`}
          </MetaItem>
          {event.price > 0 && (
            <MetaItem>
              <FiStar />
              ${event.price}
            </MetaItem>
          )}
        </EventMeta>

        <EventDescription>
          {event.description}
        </EventDescription>

        <ActionButtons>
          {userRSVP ? (
            <PrimaryButton onClick={() => handleRSVP(null)} disabled={rsvpLoading}>
              {rsvpLoading ? 'Updating...' : 'Remove RSVP'}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => handleRSVP('attending')} disabled={rsvpLoading}>
              {rsvpLoading ? 'RSVPing...' : 'RSVP to Event'}
            </PrimaryButton>
          )}
          
          <SecondaryButton>
            <FiShare2 />
            Share
          </SecondaryButton>
          
          <SecondaryButton>
            <FiHeart />
            Save
          </SecondaryButton>
        </ActionButtons>
      </EventHeader>

      {event.host && (
        <HostSection>
          <SectionTitle>
            <FiUser />
            Event Host
          </SectionTitle>
          
          <HostHeader>
            <HostAvatar>
              {event.host.name?.charAt(0)?.toUpperCase() || 'H'}
            </HostAvatar>
            <HostInfo>
              <HostName>{event.host.name}</HostName>
              <HostStats>
                <span>{event.host.points || 0} points</span>
                <span>•</span>
                <span>{event.host.badges?.length || 0} badges</span>
                {event.host.streaks?.longest > 0 && (
                  <>
                    <span>•</span>
                    <span>{event.host.streaks.longest} day streak</span>
                  </>
                )}
              </HostStats>
            </HostInfo>
          </HostHeader>

          {event.host.badges && event.host.badges.length > 0 && (
            <HostBadges>
              {event.host.badges.map((badge, index) => (
                <Badge key={index}>
                  {badge.type.replace('_', ' ')}
                </Badge>
              ))}
            </HostBadges>
          )}
        </HostSection>
      )}

      {attendees.length > 0 && (
        <AttendeesSection>
          <SectionTitle>
            <FiUsers />
            Who's Attending ({attendingCount})
          </SectionTitle>
          
          <AttendeesList>
            {attendees.map((rsvp, index) => (
              <AttendeeCard key={index}>
                <AttendeeAvatar>
                  {rsvp.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AttendeeAvatar>
                <AttendeeName>{rsvp.user.name}</AttendeeName>
              </AttendeeCard>
            ))}
            {attendingCount > 6 && (
              <AttendeeCard>
                <AttendeeAvatar>+{attendingCount - 6}</AttendeeAvatar>
                <AttendeeName>and {attendingCount - 6} more</AttendeeName>
              </AttendeeCard>
            )}
          </AttendeesList>
        </AttendeesSection>
      )}
    </EventDetailContainer>
  );
};

export default EventDetail;
