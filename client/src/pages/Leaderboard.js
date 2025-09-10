import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiAward, 
  FiUsers, 
  FiStar, 
  FiZap,
  FiTrendingUp
} from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardContainer = styled.div`
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
  max-width: 600px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  background: white;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f8fafc'};
    color: ${props => props.active ? 'white' : '#3b82f6'};
  }
`;

const LeaderboardSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const LeaderboardHeader = styled.div`
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

const UpdateTime = styled.p`
  color: #64748b;
  font-size: 0.875rem;
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: ${props => {
    if (props.rank === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (props.rank === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)';
    if (props.rank === 3) return 'linear-gradient(135deg, #cd7f32, #daa520)';
    return '#f8fafc';
  }};
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const Rank = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    if (props.rank === 1) return '#ffd700';
    if (props.rank === 2) return '#c0c0c0';
    if (props.rank === 3) return '#cd7f32';
    return '#e2e8f0';
  }};
  color: ${props => {
    if (props.rank <= 3) return 'white';
    return '#64748b';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const UserLocation = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const UserStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #475569;
  }
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

const StatDescription = styled.p`
  color: #64748b;
  font-weight: 500;
`;

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('attendees');
  const [leaderboardData, setLeaderboardData] = useState({
    attendees: [],
    hosts: [],
    streaks: [],
    badges: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const tabs = [
    { id: 'attendees', label: 'Top Attendees', icon: FiUsers },
    { id: 'hosts', label: 'Top Hosts', icon: FiStar },
    { id: 'streaks', label: 'Streak Masters', icon: FiZap },
    { id: 'badges', label: 'Badge Collectors', icon: FiAward }
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const [attendeesRes, hostsRes, streaksRes, badgesRes] = await Promise.all([
        axios.get('/api/leaderboard/attendees?limit=10'),
        axios.get('/api/leaderboard/hosts?limit=10'),
        axios.get('/api/leaderboard/streaks?limit=10'),
        axios.get('/api/leaderboard/badges?limit=10')
      ]);

      setLeaderboardData({
        attendees: attendeesRes.data,
        hosts: hostsRes.data,
        streaks: streaksRes.data,
        badges: badgesRes.data
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FiAward />;
    if (rank === 2) return <FiStar />;
    if (rank === 3) return <FiStar />;
    return null;
  };

  const getStatValue = (user, type) => {
    switch (type) {
      case 'attendees':
        return user.attendedCount || 0;
      case 'hosts':
        return user.totalRSVPs || 0;
      case 'streaks':
        return user.streaks?.longest || 0;
      case 'badges':
        return user.badgeCount || 0;
      default:
        return 0;
    }
  };

  const getStatLabel = (type) => {
    switch (type) {
      case 'attendees':
        return 'Events';
      case 'hosts':
        return 'RSVPs';
      case 'streaks':
        return 'Days';
      case 'badges':
        return 'Badges';
      default:
        return '';
    }
  };

  const currentData = leaderboardData[activeTab] || [];

  return (
    <LeaderboardContainer>
      <Header>
        <Title>
          <FiAward />
          Leaderboard
        </Title>
        <Subtitle>
          See who's leading the community! Track top attendees, hosts, 
          streak masters, and badge collectors.
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <FiUsers />
          </StatIcon>
          <StatNumber>{leaderboardData.attendees.length}</StatNumber>
          <StatDescription>Active Attendees</StatDescription>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <FiStar />
          </StatIcon>
          <StatNumber>{leaderboardData.hosts.length}</StatNumber>
          <StatDescription>Event Hosts</StatDescription>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <FiZap />
          </StatIcon>
          <StatNumber>
            {Math.max(...leaderboardData.streaks.map(s => s.streaks?.longest || 0), 0)}
          </StatNumber>
          <StatDescription>Longest Streak</StatDescription>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <FiAward />
          </StatIcon>
          <StatNumber>
            {Math.max(...leaderboardData.badges.map(b => b.badgeCount || 0), 0)}
          </StatNumber>
          <StatDescription>Most Badges</StatDescription>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon />
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <LeaderboardSection>
        <LeaderboardHeader>
          <SectionTitle>
            {tabs.find(tab => tab.id === activeTab)?.icon && 
              React.createElement(tabs.find(tab => tab.id === activeTab).icon)
            }
            {tabs.find(tab => tab.id === activeTab)?.label}
          </SectionTitle>
          {lastUpdated && (
            <UpdateTime>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </UpdateTime>
          )}
        </LeaderboardHeader>

        {loading ? (
          <LoadingSpinner text="Loading leaderboard..." />
        ) : currentData.length > 0 ? (
          <LeaderboardList>
            {currentData.map((user, index) => (
              <LeaderboardItem
                key={user._id}
                rank={index + 1}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Rank rank={index + 1}>
                  {getRankIcon(index + 1)}
                  {index + 1}
                </Rank>

                <UserInfo>
                  <UserAvatar>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{user.name}</UserName>
                    <UserLocation>
                      {user.location?.city && user.location?.state 
                        ? `${user.location.city}, ${user.location.state}`
                        : 'Location not set'
                      }
                    </UserLocation>
                    {user.badges && user.badges.length > 0 && (
                      <BadgesContainer>
                        {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                          <Badge key={badgeIndex}>
                            {badge.type.replace('_', ' ')}
                          </Badge>
                        ))}
                        {user.badges.length > 3 && (
                          <Badge>+{user.badges.length - 3} more</Badge>
                        )}
                      </BadgesContainer>
                    )}
                  </UserDetails>
                </UserInfo>

                <UserStats>
                  <StatValue>{getStatValue(user, activeTab)}</StatValue>
                  <StatLabel>{getStatLabel(activeTab)}</StatLabel>
                  {user.points && (
                    <>
                      <StatValue style={{ fontSize: '1rem', color: '#3b82f6' }}>
                        {user.points}
                      </StatValue>
                      <StatLabel>Points</StatLabel>
                    </>
                  )}
                </UserStats>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        ) : (
          <EmptyState>
            <h3>No data available</h3>
            <p>Check back later for leaderboard updates!</p>
          </EmptyState>
        )}
      </LeaderboardSection>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
