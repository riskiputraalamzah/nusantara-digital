import { useState, useEffect, useRef, useCallback } from 'react';

// impor gambar
import img1 from '../assets/hero-title1.png';
import img2 from '../assets/hero-title2.png';
import img3 from '../assets/hero-title3.png';
import img4 from '../assets/hero-title4.png';
import img5 from '../assets/hero-title5.png';
import img6 from '../assets/hero-title6.png';
import hero from '../assets/hero-image.png';

const titleFrames = [
    { label: 'Batavia', image: img1 },
    { label: 'Jayakarta', image: img2 },
    { label: 'Sunda Kelapa', image: img3 },
    { label: 'Jakarta Merdeka', image: img4 },
    { label: 'Jakarta Modern', image: img5 },
    { label: 'Jakarta Digital', image: img6 },
];

const timelineCards = [
    {
        title: 'Batavia',
        description: 'Batavia adalah nama yang diberikan oleh penjajah Belanda untuk kota pelabuhan yang kemudian berkembang menjadi ibu kota Hindia Belanda',
        positionClass: 'h-[273px] lg:mb-68',
    },
    {
        title: 'Jayakarta',
        description: 'Jayakarta adalah nama lama dari kota Jakarta sebelum diubah menjadi Batavia pada masa penjajahan Belanda',
        positionClass: 'h-[230px] lg:mt-15',
    },
    {
        title: 'Sunda Kelapa',
        description: 'Sunda Kelapa adalah pelabuhan tua bersejarah di Jakarta yang terletak di muara Sungai Ciliwung, Jakarta Utara',
        positionClass: 'h-[249px] lg:mt-3',
    },
    {
        title: 'Jakarta Merdeka',
        description: 'Jakarta adalah nama ibu kota Republik Indonesia yang sebelumnya dikenal dengan nama Batavia pada masa penjajahan Belanda',
        positionClass: 'h-[249px] lg:-mt-15',
    },
];

const SCROLL_STEP_DELTA = 18;
const SCROLL_STEP_COOLDOWN = 260;

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCardCount, setVisibleCardCount] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [opacity, setOpacity] = useState(1);

    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const heroRef = useRef(null);
    const cardsRef = useRef(null);
    const currentIndexRef = useRef(0);
    const titleStepRef = useRef(0);
    const cardStageRef = useRef(0);
    const sequencePhaseRef = useRef('title');
    const fadeTimeoutRef = useRef(null);
    const lastScrollStepAtRef = useRef(0);
    const wheelDeltaRef = useRef(0);
    const touchStartYRef = useRef(null);

    const updateContainerWidth = useCallback((imgW, imgH) => {
        if (!containerRef.current) return;
        const containerHeight = containerRef.current.clientHeight;
        if (imgH > 0 && containerHeight > 0) {
            const newWidth = imgW * (containerHeight / imgH);
            containerRef.current.style.width = `${newWidth}px`;
        }
    }, []);

    const showTitleFrame = useCallback((nextIndex, animate = false) => {
        const normalizedIndex = (nextIndex + titleFrames.length) % titleFrames.length;

        if (fadeTimeoutRef.current) {
            window.clearTimeout(fadeTimeoutRef.current);
            fadeTimeoutRef.current = null;
        }

        if (!animate || normalizedIndex === currentIndexRef.current) {
            currentIndexRef.current = normalizedIndex;
            setCurrentIndex(normalizedIndex);
            setOpacity(1);
            return;
        }

        setOpacity(0);
        fadeTimeoutRef.current = window.setTimeout(() => {
            currentIndexRef.current = normalizedIndex;
            setCurrentIndex(normalizedIndex);
            setOpacity(1);
            fadeTimeoutRef.current = null;
        }, 260);
    }, []);

    const applyCardStage = useCallback((nextStage) => {
        const stage = Math.max(0, Math.min(timelineCards.length, nextStage));

        if (cardStageRef.current === stage) {
            return;
        }

        cardStageRef.current = stage;
        setVisibleCardCount(stage);
        setIsAutoPlaying(false);
    }, []);

    const scrollToCardSequence = useCallback(() => {
        if (!cardsRef.current) return;

        const cardTop = window.scrollY + cardsRef.current.getBoundingClientRect().top;
        const targetTop = Math.max(0, cardTop - window.innerHeight * 0.58);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }, []);

    const completeScrollSequence = useCallback(() => {
        sequencePhaseRef.current = 'done';
        wheelDeltaRef.current = 0;
        cardStageRef.current = timelineCards.length;
        setVisibleCardCount(timelineCards.length);
        setIsAutoPlaying(true);
    }, []);

    const enterCardSequence = useCallback(() => {
        sequencePhaseRef.current = 'cards';
        wheelDeltaRef.current = 0;
        titleStepRef.current = titleFrames.length;
        setIsAutoPlaying(false);
        showTitleFrame(titleFrames.length - 1, true);
        window.setTimeout(scrollToCardSequence, 120);
    }, [scrollToCardSequence, showTitleFrame]);

    const stepTitleSequence = useCallback((direction) => {
        if (direction < 0) {
            if (titleStepRef.current === 0) return;

            titleStepRef.current -= 1;
            showTitleFrame(Math.min(titleStepRef.current, titleFrames.length - 1), true);
            return;
        }

        const nextStep = titleStepRef.current + 1;
        titleStepRef.current = nextStep;

        if (nextStep >= titleFrames.length) {
            enterCardSequence();
            return;
        }

        showTitleFrame(nextStep, true);
    }, [enterCardSequence, showTitleFrame]);

    const stepCardSequence = useCallback((direction) => {
        if (direction < 0) {
            if (cardStageRef.current > 0) {
                applyCardStage(cardStageRef.current - 1);
                return;
            }

            sequencePhaseRef.current = 'title';
            titleStepRef.current = titleFrames.length - 1;
            showTitleFrame(titleFrames.length - 1, true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const nextStage = Math.min(timelineCards.length, cardStageRef.current + 1);
        applyCardStage(nextStage);

        if (nextStage === timelineCards.length) {
            window.setTimeout(completeScrollSequence, 360);
        }
    }, [applyCardStage, completeScrollSequence, showTitleFrame]);

    const stepScrollSequence = useCallback((direction) => {
        const now = window.performance.now();

        if (sequencePhaseRef.current === 'done' || now - lastScrollStepAtRef.current < SCROLL_STEP_COOLDOWN) {
            return;
        }

        if (sequencePhaseRef.current === 'title') {
            lastScrollStepAtRef.current = now;
            stepTitleSequence(direction);
            return;
        }

        lastScrollStepAtRef.current = now;
        stepCardSequence(direction);
    }, [stepCardSequence, stepTitleSequence]);

    // Sequence dibagi dua: judul dulu di top, lalu card setelah viewport turun sedikit.
    useEffect(() => {
        const shouldControlHeroScroll = () => sequencePhaseRef.current !== 'done';

        const handleWheel = (event) => {
            if (!shouldControlHeroScroll() || event.deltaY === 0) return;

            const direction = event.deltaY > 0 ? 1 : -1;
            if (direction < 0 && sequencePhaseRef.current === 'title' && titleStepRef.current === 0) return;

            event.preventDefault();
            wheelDeltaRef.current += Math.abs(event.deltaY);

            if (wheelDeltaRef.current < SCROLL_STEP_DELTA) return;

            wheelDeltaRef.current = 0;
            stepScrollSequence(direction);
        };

        const handleKeyDown = (event) => {
            if (!shouldControlHeroScroll()) return;

            const downKeys = ['ArrowDown', 'PageDown', 'End'];
            const upKeys = ['ArrowUp', 'PageUp', 'Home'];
            const isSpaceDown = event.key === ' ' && !event.shiftKey;
            const isSpaceUp = event.key === ' ' && event.shiftKey;

            if (downKeys.includes(event.key) || isSpaceDown) {
                event.preventDefault();
                stepScrollSequence(1);
            }

            if (upKeys.includes(event.key) || isSpaceUp) {
                event.preventDefault();
                stepScrollSequence(-1);
            }
        };

        const handleTouchStart = (event) => {
            touchStartYRef.current = event.touches[0]?.clientY ?? null;
        };

        const handleTouchMove = (event) => {
            if (!shouldControlHeroScroll() || touchStartYRef.current === null) return;

            const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
            const deltaY = touchStartYRef.current - currentY;

            if (Math.abs(deltaY) < 36) return;
            if (deltaY < 0 && sequencePhaseRef.current === 'title' && titleStepRef.current === 0) return;

            event.preventDefault();
            touchStartYRef.current = currentY;
            stepScrollSequence(deltaY > 0 ? 1 : -1);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [stepScrollSequence]);

    // buat Perbarui lebar saat ukuran diubah
    useEffect(() => {
        const handleResize = () => {
            if (imgRef.current) {
                updateContainerWidth(imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateContainerWidth]);

    // Setelah card sequence selesai, judul kembali berputar otomatis.
    useEffect(() => {
        if (!isAutoPlaying) return undefined;

        const interval = setInterval(() => {
            showTitleFrame(currentIndexRef.current + 1, true);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, showTitleFrame]);

    useEffect(() => {
        return () => {
            if (fadeTimeoutRef.current) {
                window.clearTimeout(fadeTimeoutRef.current);
            }
        };
    }, []);

    const handleImageLoad = (e) => {
        updateContainerWidth(e.target.naturalWidth, e.target.naturalHeight);
    };

    return (
        <section ref={heroRef} className="w-full min-h-[85vh] flex flex-col items-center justify-start pb-20 pt-10 overflow-hidden">
            <div className="flex flex-col  px-4 md:px-6 items-center justify-center text-center mt-8 mb-12">
                {/* Baris Pertama dengan Gambar Dinamis */}
                <div className="flex items-center justify-center whitespace-nowrap gap-1 sm:gap-2 md:gap-4 lg:gap-5 xl:gap-6 text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black tracking-tight leading-[1.2] md:leading-[1.1]">
                    <span>Dari Jejak</span>
                    {/* Pembungkus untuk gambar. Skala disesuaikan agar tidak melebihi batas */}
                    <div
                        ref={containerRef}
                        className="flex items-center justify-center h-6 sm:h-8 md:h-12 lg:h-16 xl:h-24 transition-[width] duration-500 ease-in-out"
                    >
                        <img
                            ref={imgRef}
                            src={titleFrames[currentIndex].image}
                            className="h-full w-auto object-contain transition-opacity duration-500 ease-in-out select-none"
                            alt={titleFrames[currentIndex].label}
                            style={{ opacity }}
                            onLoad={handleImageLoad}
                        />
                    </div>
                    <span>Menuju</span>
                </div>

                {/* Baris Kedua */}
                <div className="mt-2 md:mt-4 lg:mt-5 xl:mt-6 text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black tracking-tight leading-[1.2] md:leading-[1.1]">
                    jakarta Kota Digital
                </div>
            </div>

            {/* Hero Image Section as Background */}
            <div
                className="w-full mx-auto max-w-7xl mb-8 relative mt-16 rounded-2xl bg-no-repeat bg-cover bg-bottom flex flex-col items-center justify-start min-h-[350px] md:min-h-[450px] lg:min-h-[650px]"
                style={{ backgroundImage: `url(${hero})` }}
            >
                {/* Search Bar Overlapping */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-3/4 max-w-[684px] z-10">
                    <div className="bg-white/80 backdrop-blur-lg backdrop-saturate-150 rounded-3xl flex items-center px-6 py-3 mt-8 md:py-4 shadow-[3px_3px_3px_rgba(0,0,0,0.1)] border border-black/10 focus-within:bg-white/60 focus-within:ring-2 focus-within:ring-white/80 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 shrink-0 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Jelajahi Sejarah, budaya, kuliner, dll"
                            className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base md:text-lg font-medium"
                        />
                    </div>
                </div>


                <div ref={cardsRef} className="absolute left-1/2 -translate-x-1/2 translate-y-1/3 w-full max-w-6xl px-4 z-10">
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-3">
                        {timelineCards.map((card, index) => {
                            const isVisible = index < visibleCardCount;

                            return (
                                <div
                                    key={card.title}
                                    aria-hidden={!isVisible}
                                    className={`card-reveal w-full md:w-[281px] ${card.positionClass} shrink-0 bg-white/70 backdrop-blur-xs backdrop-saturate-150 rounded-[20px] p-[25px] border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col gap-[10px] hover:bg-white/75 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-16 pointer-events-none'}`}
                                    style={{ transitionDelay: isVisible ? `${index * 90}ms` : '0ms' }}
                                >
                                    <h3 className="text-xl font-bold text-black">{card.title}</h3>
                                    <p className="text-sm text-black leading-relaxed">
                                        {card.description}
                                    </p>
                                    <a href="#" className="mt-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors duration-200">
                                        Mulai Jelajah
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Spacer biar konten di bawah hero ga ketimpa kartu */}
            <div className="h-24 md:h-32 lg:h-40 w-full"></div>
        </section>
    );
};

export default Hero;
