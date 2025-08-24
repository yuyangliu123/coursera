import React, { useEffect, useRef, useState } from 'react';
import { Image, Skeleton } from "@chakra-ui/react";
import { generateImageUrl } from './imageConvert';

const LazyLoadImage = ({ src, alt, imgWidth, auto, ...props }) => {
    const imgRef = useRef();

    useEffect(() => {
        const img = imgRef.current;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = generateImageUrl({ src, imgWidth, auto });
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.0
        });

        if (img) {
            observer.observe(img);

        }

        return () => {
            if (img) {
                observer.unobserve(img);
            }
        };
    }, [src, imgWidth, auto]);

    return (
        <>
            <Image ref={imgRef} data-src={generateImageUrl({ src, imgWidth, auto })} alt={alt} {...props} />
        </>
    );
};
export default LazyLoadImage;
