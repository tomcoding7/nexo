import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiUsers,
  FiDollarSign,
  FiImage,
  FiTag,
  FiSave
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CreateEventContainer = styled.div`
  max-width: 800px;
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
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
`;

const PrimaryButton = styled(Button)`
  background: #3b82f6;
  color: white;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
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

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  color: #16a34a;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
  font-size: 0.875rem;
`;

const CreateEvent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      name: '',
      address: '',
      city: '',
      state: ''
    },
    dateTime: '',
    endDateTime: '',
    category: '',
    maxAttendees: '',
    price: '',
    image: '',
    tags: ''
  });

  const categories = [
    'technology', 'music', 'sports', 'food', 'art',
    'education', 'networking', 'fitness', 'gaming', 'outdoor'
  ];

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for submission
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await axios.post('/api/events', eventData);
      
      setSuccess('Event created successfully! It will be reviewed before going live.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: {
          name: '',
          address: '',
          city: '',
          state: ''
        },
        dateTime: '',
        endDateTime: '',
        category: '',
        maxAttendees: '',
        price: '',
        image: '',
        tags: ''
      });

      // Redirect to event detail after a delay
      setTimeout(() => {
        navigate(`/events/${response.data._id}`);
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <CreateEventContainer>
      <Header>
        <Title>Create New Event</Title>
        <Subtitle>
          Share your event with the community and start building your audience
        </Subtitle>
      </Header>

      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <FiCalendar />
              Event Details
            </SectionTitle>

            <FormGroup>
              <Label>Event Title *</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                placeholder="Describe your event in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Category *</Label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Tags (comma-separated)</Label>
                <Input
                  type="text"
                  name="tags"
                  placeholder="networking, tech, startup"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FiMapPin />
              Location
            </SectionTitle>

            <FormGroup>
              <Label>Venue Name *</Label>
              <Input
                type="text"
                name="location.name"
                placeholder="e.g., Community Center, Coffee Shop"
                value={formData.location.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Address *</Label>
              <Input
                type="text"
                name="location.address"
                placeholder="123 Main St"
                value={formData.location.address}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>City *</Label>
                <Input
                  type="text"
                  name="location.city"
                  placeholder="San Francisco"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>State *</Label>
                <Input
                  type="text"
                  name="location.state"
                  placeholder="CA"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FiClock />
              Date & Time
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>Start Date & Time *</Label>
                <Input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>End Date & Time *</Label>
                <Input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FiUsers />
              Event Settings
            </SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>Max Attendees</Label>
                <Input
                  type="number"
                  name="maxAttendees"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Event Image URL</Label>
              <Input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </FormGroup>
          </FormSection>

          <ButtonGroup>
            <SecondaryButton type="button" onClick={handleCancel}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              <FiSave />
              {loading ? 'Creating Event...' : 'Create Event'}
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </FormCard>
    </CreateEventContainer>
  );
};

export default CreateEvent;
