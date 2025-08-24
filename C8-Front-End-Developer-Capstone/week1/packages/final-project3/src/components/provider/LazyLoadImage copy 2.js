import React, { useEffect, useRef, useState } from 'react';
import { Image } from "@chakra-ui/react";

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
                        const encodedSrc = encodeURIComponent(src);
                        const imageUrl = `http://localhost:5000/img?url=${encodedSrc}&w=${imgWidth}&auto=${auto}`;
                        img.src = imageUrl;
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
        <Image ref={imgRef} data-src={`http://localhost:5000/img?url=${encodeURIComponent(src)}&w=${imgWidth}&auto=${auto}`} alt={alt} {...props} />
    );
};

export default LazyLoadImage;
