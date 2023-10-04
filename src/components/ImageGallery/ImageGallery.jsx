import { Button } from 'components/Button/Button';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { animateScroll } from 'react-scroll';
import { getImg } from 'services/api';
import { GalleryList } from './ImageGallery.styled';
import { useEffect, useState } from 'react';

export const ImageGallery =({value})=> {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [pages, setPages] = useState(1);
  const [viewImage, setViewImage] = useState('');
 
//зкидаємо масив з фкартинками та поточну сторінку на дефолтну, рпи зміні запиту
  useEffect(() => {
    setImages([]);
    setPages(1);
  }, [value]);

  // робимо запит на сервер при зміні значення запиту чи поточної сторінки
useEffect(() => {
  if (!value) return
  setStatus('pending');
  
  const fetchImages = async (value, pages) => {
    
    try {
      const images = await getImg(value, pages);

      if (images.status === 200) {
        if(pages === 1) {
          setImages(images.data.hits);
        } else {
        setImages(prevState=> [...prevState,...images.data.hits]);
        }
        setStatus('resolved');
        setIsLoad(pages < Math.ceil(images.data.totalHits / 12));
      } else {
        return Promise.reject('Error');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  fetchImages(value, pages);
  
}, [value, pages]);


// зміна поточної сторінки при натисканні на кнопку лоад мор
  const onLoadMore = () => {
    setPages(prevState => prevState + 1);
    scrollToBottom();
  };

  //забираємо айді картинки на яку натиснули, та відображаємо модалку
  const onImageClick = id => {
    setViewImage(images.find(img => img.id === id));
    setModalIsOpen(true);
  };
// закриття модалки
  const onCloseModal = () => {
    setModalIsOpen(false);
  };
// смузі скрл, при заванатженні додаткових картинок
  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      duration: 1600,
      delay: 10,
      smooth: 'linear',
    });
  };

    const { largeImageURL, tags } = viewImage;

    if (status === 'pending') {
      return <Loader />;
    }

    if (status === 'resolved' && images.length > 0) {
      return (
        <>
          <GalleryList className="gallery">
            {images.map(item => (
              <ImageGalleryItem
                data={item}
                key={item.id}
                onImageClick={onImageClick}
              />
            ))}
          </GalleryList>
          <Button onLoadMore={onLoadMore} isLoad={isLoad}/>
          {modalIsOpen && (
            <Modal
              viewImage={viewImage}
              onCloseModal={onCloseModal}>
              <img src={largeImageURL} alt={tags} />
            </Modal>
          )}
        </>
      );
    } else if (status === 'error') {
      return (
        <div>
          Oh, something went wrong (=. Try reloading the page and entering a new
          request
        </div>
      );
    } 
   
  }

