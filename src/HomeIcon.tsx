import React from 'react';
import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HomeIcon: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div id='home-icon'>
        <FiHome
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        size={24} // You can adjust the size here
        />
    </div>
  );
};

export default HomeIcon;
