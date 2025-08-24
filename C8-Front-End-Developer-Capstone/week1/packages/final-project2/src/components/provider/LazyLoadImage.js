import React, { useEffect, useRef, useState } from 'react';
import { Image } from "@chakra-ui/react";
import  { generateImageUrl } from './imageConvert';

const LazyLoadImage = ({ src, alt, imgWidth, auto, ...props }) => {
    const imgRef = useRef();
    const [firstLoading, setFirstLoading] = useState(false);

    useEffect(() => {
        if (!firstLoading) {
            const img = imgRef.current;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = generateImageUrl({src, imgWidth, auto});
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                root: null,
                rootMargin: '200px 0px',
                threshold: 0.0
            });

            observer.observe(img);

            return () => {
                if (img) {
                    observer.unobserve(img);
                }
                setFirstLoading(true);
            };
        }
    }, [firstLoading]);

    return (
        <Image ref={imgRef} data-src={generateImageUrl({src, imgWidth, auto})} alt={alt} {...props} />
    );
};

export default LazyLoadImage;
