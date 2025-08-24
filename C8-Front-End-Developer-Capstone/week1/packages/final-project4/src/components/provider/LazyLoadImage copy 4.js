import React, { useEffect, useRef, useState } from 'react';
import { Image } from "@chakra-ui/react";
import axios from 'axios';
import pako from 'pako';

const LazyLoadImage = ({ src, alt, imgWidth, auto, ...props }) => {
    const imgRef = useRef();
    const [firstLoading, setFirstLoading] = useState(false);

    useEffect(() => {
        if (!firstLoading) {
            const img = imgRef.current;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const encodedSrc = encodeURIComponent(src);
                        const imageUrl = `http://localhost:5000/img?url=${encodedSrc}&w=${imgWidth}&auto=${auto}`;

                        try {
                            const response = await axios.get(imageUrl, {
                                responseType: 'arraybuffer',
                            });

                            console.log('Response data:', response.data);

                            // 使用 pako.inflate 解壓縮數據
                            const decompressedData = pako.inflate(new Uint8Array(response.data));
                            const blob = new Blob([decompressedData], { type: 'image/webp' });
                            const url = URL.createObjectURL(blob);

                            img.src = url;
                        } catch (error) {
                            console.error('Error loading image:', error);
                        }

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
