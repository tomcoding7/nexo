import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiCalendar,
  FiX
} from 'react-icons/fi';
import axios from 'axios';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const EventsContainer = styled.div`
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

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearFilters = styled.button`
  color: #64748b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #3b82f6;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const FilterGroup = styled.div`
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.25rem;
`;

const ResultsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultsCount = styled.p`
  color: #64748b;
  font-weight: 500;
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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
  
  p {
    margin-bottom: 2rem;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RemoveFilter = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    date: searchParams.get('date') || '',
    sort: searchParams.get('sort') || 'date'
  });

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await axios.get(`/api/events?${params.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      state: '',
      date: '',
      sort: 'date'
    });
    setSearchParams({});
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    setSearchParams(params);
  };

  const getActiveFilters = () => {
    return Object.entries(filters).filter(([key, value]) => value && key !== 'sort');
  };

  const categories = [
    'technology', 'music', 'sports', 'food', 'art', 
    'education', 'networking', 'fitness', 'gaming', 'outdoor'
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' }
  ];

  return (
    <EventsContainer>
      <Header>
        <Title>Discover Events</Title>
        <Subtitle>
          Find amazing events happening in your area. Filter by category, 
          location, or date to discover exactly what you're looking for.
        </Subtitle>
      </Header>

      <FiltersSection>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter />
            Filters
          </FiltersTitle>
          {getActiveFilters().length > 0 && (
            <ClearFilters onClick={clearFilters}>
              <FiX />
              Clear All
            </ClearFilters>
          )}
        </FiltersHeader>

        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </SearchContainer>

        {getActiveFilters().length > 0 && (
          <ActiveFilters>
            {getActiveFilters().map(([key, value]) => (
              <FilterTag key={key}>
                {key}: {value}
                <RemoveFilter onClick={() => removeFilter(key)}>
                  <FiX size={14} />
                </RemoveFilter>
              </FilterTag>
            ))}
          </ActiveFilters>
        )}

        <FiltersGrid>
          <FilterGroup>
            <label>Category</label>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <label>City</label>
            <Input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <label>State</label>
            <Input
              type="text"
              placeholder="Enter state"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Date</label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersSection>

      <ResultsSection>
        <ResultsCount>
          {loading ? 'Loading...' : `${events.length} events found`}
        </ResultsCount>
        <SortSelect
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </SortSelect>
      </ResultsSection>

      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length > 0 ? (
        <EventsGrid>
          {events.map((event, index) => (
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
          <h3>No events found</h3>
          <p>
            Try adjusting your filters or search terms to find more events.
          </p>
        </EmptyState>
      )}
    </EventsContainer>
  );
};

export default Events;
