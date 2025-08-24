import { Image } from '@chakra-ui/react';
import React from 'react';

export const generateImageUrl = ({ src, imgWidth, auto }) => {
    const encodedSrc = encodeURIComponent(src);
    return `http://localhost:5000/img?url=${encodedSrc}&w=${imgWidth}&auto=${auto}`;
};

export const ImageConvert = ({ src, imgWidth, auto, ...prop }) => {
    const imageUrl = generateImageUrl({ src, imgWidth, auto });

    return <Image src={imageUrl} {...prop} />;
};
