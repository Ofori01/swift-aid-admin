import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ghanaPolice from "@/assets/ghana_police.jpg";
import ghanaAmbulance from "@/assets/ghana_ambulance.jpg";
import ghanaFireService from "@/assets/ghana_fire_service.jpg";

const LoginCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const carouselImages = [
    {
      src: ghanaPolice,
      alt: "Ghana Police Service",
      caption: "Ghana Police Service - Maintaining Law and Order",
    },
    {
      src: ghanaAmbulance,
      alt: "Ghana Ambulance Service",
      caption: "Ghana Ambulance Service - Emergency Medical Response",
    },
    {
      src: ghanaFireService,
      alt: "Ghana Fire Service",
      caption: "Ghana Fire Service - Fire Prevention and Rescue",
    },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla h-full relative overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="embla__slide flex-[0_0_100%] min-w-0 relative"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Caption overlay */}
            <div className="absolute bottom-8 left-6 right-6 text-white">
              <h3 className="text-lg font-semibold mb-1 drop-shadow-lg">
                {image.alt}
              </h3>
              <p className="text-sm opacity-90 drop-shadow-lg">
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex
                ? "bg-white/90"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginCarousel;
