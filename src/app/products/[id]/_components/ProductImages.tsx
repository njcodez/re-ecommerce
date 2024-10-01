import React, { useState } from 'react';
import styled from 'styled-components';

interface ProductImagesProps {
  images: string[] | undefined;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images = [],
}) => {
  const [imageIndex, setImageIndex] = useState<number>(0);

  return (
    <Wrapper>
      <MainImageContainer>
        <img src={images[imageIndex]} alt='main' className='main' />
      </MainImageContainer>
      <div className='gallery'>
        {images.map((image, index) => (
          <ThumbnailContainer key={image}>
            <img
              src={image}
              alt=''
              onClick={() => setImageIndex(index)}
              className={index === imageIndex ? 'active' : undefined}
            />
          </ThumbnailContainer>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .main {
    height: 600px;
    border-radius: 10%;
    object-fit: contain;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
`;

const MainImageContainer = styled.div`
  border-radius: 10%;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

`;

const ThumbnailContainer = styled.div`
  border-radius: 10%;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  
  img {
    height: 100px;
    width: 100%;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 576px) {
    img {
      height: 50px;
    }
  }

  @media (min-width: 992px) {
    img {
      height: 75px;
    }
  }
`;

export default ProductImages;
