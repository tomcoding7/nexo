import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiMapPin, 
  FiCalendar,
  FiTrophy,
  FiStar,
  FiZap,
  FiAward,
  FiEdit3,
  FiSave,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';

const ProfileContainer = styled.div`
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
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  height: fit-content;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 2rem;
  margin: 0 auto 1rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #64748b;
  margin-bottom: 1rem;
`;

const UserLocation = styled.p`
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const BadgesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Badge = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  background: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #15803d;
  }
`;

const CancelButton = styled.button`
  background: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #b91c1c;
  }
`;

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    location: {
      city: '',
      state: ''
    },
    interests: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setEditData({
        name: user.name || '',
        location: {
          city: user.location?.city || '',
          state: user.location?.state || ''
        },
        interests: user.interests || []
      });
    }
  }, [isAuthenticated, navigate, user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      name: user.name || '',
      location: {
        city: user.location?.city || '',
        state: user.location?.state || ''
      },
      interests: user.interests || []
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(editData);
    
    if (result.success) {
      setEditing(false);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'city' || name === 'state') {
      setEditData({
        ...editData,
        location: {
          ...editData.location,
          [name]: value
        }
      });
    } else {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <Header>
        <Title>My Profile</Title>
      </Header>

      <ProfileGrid>
        <ProfileCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileHeader>
            <Avatar>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <UserLocation>
              <FiMapPin />
              {user.location?.city && user.location?.state 
                ? `${user.location.city}, ${user.location.state}`
                : 'Location not set'
              }
            </UserLocation>
          </ProfileHeader>

          <StatsGrid>
            <StatCard>
              <StatValue>{user.points || 0}</StatValue>
              <StatLabel>Points</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.badges?.length || 0}</StatValue>
              <StatLabel>Badges</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.streaks?.current || 0}</StatValue>
              <StatLabel>Current Streak</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{user.streaks?.longest || 0}</StatValue>
              <StatLabel>Longest Streak</StatLabel>
            </StatCard>
          </StatsGrid>

          <BadgesSection>
            <SectionTitle>
              <FiAward />
              Badges
            </SectionTitle>
            {user.badges && user.badges.length > 0 ? (
              <BadgesList>
                {user.badges.map((badge, index) => (
                  <Badge key={index}>
                    {badge.type.replace('_', ' ')}
                  </Badge>
                ))}
              </BadgesList>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                No badges yet. Attend events to earn your first badge!
              </p>
            )}
          </BadgesSection>

          {editing ? (
            <EditForm onSubmit={handleSave}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={editData.location.city}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>State</Label>
                <Input
                  type="text"
                  name="state"
                  value={editData.location.state}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <ButtonGroup>
                <SaveButton type="submit" disabled={loading}>
                  <FiSave />
                  Save
                </SaveButton>
                <CancelButton type="button" onClick={handleCancel}>
                  <FiX />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </EditForm>
          ) : (
            <EditButton onClick={handleEdit}>
              <FiEdit3 />
              Edit Profile
            </EditButton>
          )}
        </ProfileCard>

        <ContentSection>
          <Section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SectionTitle>
              <FiCalendar />
              Attended Events ({user.attendedEvents?.length || 0})
            </SectionTitle>
            
            {user.attendedEvents && user.attendedEvents.length > 0 ? (
              <EventsGrid>
                {user.attendedEvents.slice(0, 6).map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </EventsGrid>
            ) : (
              <EmptyState>
                <h3>No events attended yet</h3>
                <p>Start exploring events to build your profile!</p>
              </EmptyState>
            )}
          </Section>

          <Section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <SectionTitle>
              <FiStar />
              Hosted Events ({user.hostedEvents?.length || 0})
            </SectionTitle>
            
            {user.hostedEvents && user.hostedEvents.length > 0 ? (
              <EventsGrid>
                {user.hostedEvents.slice(0, 6).map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </EventsGrid>
            ) : (
              <EmptyState>
                <h3>No events hosted yet</h3>
                <p>Create your first event to start building your community!</p>
              </EmptyState>
            )}
          </Section>
        </ContentSection>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;
