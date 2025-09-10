import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiStar,
  FiCalendar
} from 'react-icons/fi';
import { format, isToday, isTomorrow } from 'date-fns';

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #FF385C 0%, #E31C5F 50%, #FF6B8A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  overflow: hidden;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #222222;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EventTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #222222;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventDescription = styled.p`
  color: #717171;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #717171;
  font-size: 0.875rem;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f7f7f7;
  border-radius: 8px;
`;

const HostAvatar = styled.div`
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

const HostDetails = styled.div`
  flex: 1;
`;

const HostName = styled.div`
  font-weight: 600;
  color: #222222;
  font-size: 0.875rem;
`;

const HostStats = styled.div`
  color: #717171;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const RSVPCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #717171;
  font-size: 0.875rem;
`;

const ViewButton = styled(Link)`
  background: #222222;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #000000;
    transform: translateY(-1px);
  }
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
    return format(date, 'MMM d, h:mm a');
  }
};

const EventCard = ({ event }) => {
  const categoryIcon = getCategoryIcon(event.category);
  const formattedDate = formatEventDate(event.dateTime);
  const rsvpCount = event.rsvps?.filter(rsvp => rsvp.status === 'attending').length || 0;

  return (
    <Card
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <ImageContainer>
        {event.image ? (
          <EventImage src={event.image} alt={event.title} />
        ) : (
          <div style={{ fontSize: '3rem' }}>{categoryIcon}</div>
        )}
        <CategoryBadge>{event.category}</CategoryBadge>
      </ImageContainer>

      <CardContent>
        <EventTitle>{event.title}</EventTitle>
        <EventDescription>{event.description}</EventDescription>

        <EventMeta>
          <MetaItem>
            <FiClock />
            {formattedDate}
          </MetaItem>
          <MetaItem>
            <FiMapPin />
            {event.location.name}, {event.location.city}
          </MetaItem>
        </EventMeta>

        {event.host && (
          <HostInfo>
            <HostAvatar>
              {event.host.name?.charAt(0)?.toUpperCase() || 'H'}
            </HostAvatar>
            <HostDetails>
              <HostName>{event.host.name}</HostName>
              <HostStats>
                <FiStar />
                {event.host.points || 0} points
                {event.host.badges?.length > 0 && (
                  <>
                    <span>•</span>
                    {event.host.badges.length} badges
                  </>
                )}
              </HostStats>
            </HostDetails>
          </HostInfo>
        )}

        <EventStats>
          <RSVPCount>
            <FiUsers />
            {rsvpCount} attending
          </RSVPCount>
          <ViewButton to={`/events/${event._id}`}>
            View Details
          </ViewButton>
        </EventStats>
      </CardContent>
    </Card>
  );
};

export default EventCard;
