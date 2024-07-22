import React, { useEffect, useRef, useState } from 'react';
import { Image } from "@chakra-ui/react";

const LazyLoadImage = ({ src, alt, ...props }) => {
    const imgRef = useRef();
    const [firstLoading, setFirstLoading] = useState(false);

    useEffect(() => {
        if (!firstLoading) {
            const img = imgRef.current;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
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
        <Image ref={imgRef} data-src={src} alt={alt} {...props} />
    );
};

export default LazyLoadImage;
