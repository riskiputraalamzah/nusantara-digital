import { useState, useEffect, useRef } from 'react';

// Mengimpor semua gambar yang dibutuhkan
import img1 from '../assets/hero-title1.png';
import img2 from '../assets/hero-title2.png';
import img3 from '../assets/hero-title3.png';
import img4 from '../assets/hero-title4.png';
import img5 from '../assets/hero-title5.png';
import img6 from '../assets/hero-title6.png';

const images = [img1, img2, img3, img4, img5, img6];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const containerRef = useRef(null);
    const imgRef = useRef(null);

    // Fungsi untuk memperbarui lebar pembungkus
    const updateContainerWidth = (imgW, imgH) => {
        if (!containerRef.current) return;
        const containerHeight = containerRef.current.clientHeight;
        if (imgH > 0 && containerHeight > 0) {
            const newWidth = imgW * (containerHeight / imgH);
            containerRef.current.style.width = `${newWidth}px`;
        }
    };

    // Perbarui lebar saat ukuran diubah
    useEffect(() => {
        const handleResize = () => {
            if (imgRef.current) {
                updateContainerWidth(imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Logika animasi pergantian gambar
    useEffect(() => {
        const interval = setInterval(() => {
            setOpacity(0); // Pudarkan gambar (fade out)

            setTimeout(() => {
                setCurrentIndex((prev) => {
                    const nextIndex = (prev + 1) % images.length;

                    // Hitung lebar gambar baru sebelum ditampilkan agar transisinya mulus
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        updateContainerWidth(tempImg.width, tempImg.height);
                        setOpacity(1); // Tampilkan gambar baru (fade in)
                    };
                    tempImg.src = images[nextIndex];

                    return nextIndex;
                });
            }, 500); // Durasi fade out 500ms
        }, 3000); // Ganti gambar setiap 3 detik

        return () => clearInterval(interval);
    }, []);

    const handleImageLoad = (e) => {
        updateContainerWidth(e.target.naturalWidth, e.target.naturalHeight);
    };

    return (
        <section className="w-full bg-white min-h-[85vh] flex flex-col items-center justify-center px-4 md:px-6 pb-20 pt-10 font-poppins">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center whitespace-nowrap gap-1 sm:gap-2 md:gap-4 lg:gap-5 xl:gap-6 text-[1.2rem] sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black tracking-tight leading-[1.2] md:leading-[1.1]">
                    <span>Dari jejak</span>
                    <div
                        ref={containerRef}
                        className="flex items-center justify-center h-6 sm:h-8 md:h-12 lg:h-16 xl:h-24 transition-[width] duration-500 ease-in-out"
                    >
                        <img
                            ref={imgRef}
                            src={images[currentIndex]}
                            className="h-full w-auto object-contain transition-opacity duration-500 ease-in-out"
                            alt="Batavia"
                            style={{ opacity }}
                            onLoad={handleImageLoad}
                        />
                    </div>
                    <span>menuju</span>
                </div>

                <div className="mt-2 md:mt-4 lg:mt-5 xl:mt-6 text-[1.2rem] sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black tracking-tight leading-[1.2] md:leading-[1.1]">
                    jakarta kota digital
                </div>
            </div>
        </section>
    );
};

export default Hero;
