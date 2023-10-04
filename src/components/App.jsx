
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Container } from './app.styled';
import { useState } from 'react';


export const App =()=> {
  const [value, setValue] = useState('');
  
  const onSubmit = (value) => {
    setValue(value);
    
  };
  
    return (
      <Container>
        <Searchbar onSubmit={onSubmit} />
        <ImageGallery value={value} />
      </Container>
    );
 
}
