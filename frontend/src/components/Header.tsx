import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Header() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading word stagger animation
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.05,
            delay: 0.1,
            ease: 'expo.out',
          }
        );
      }

      // Emoji pop and rotate
      gsap.fromTo(
        emojiRef.current,
        { scale: 0, rotation: -15 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.5, 
          delay: 0.4,
          ease: 'elastic.out(1, 0.5)',
        }
      );

      // Subheading fade in
      const subheading = containerRef.current?.querySelector('.subheading');
      if (subheading) {
        gsap.fromTo(
          subheading,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.5, ease: 'power2.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mb-6">
      <h1 
        ref={headingRef}
        className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading flex items-center gap-2 flex-wrap"
      >
        <span className="word inline-block">Welcome</span>
        <span className="word inline-block">back,</span>
        <span className="word inline-block">John!</span>
        <span 
          ref={emojiRef}
          className="inline-block animate-wave cursor-pointer"
          style={{ transformOrigin: '70% 70%' }}
        >
          👋
        </span>
      </h1>
      <p className="subheading text-gray-500 mt-2 text-sm sm:text-base">
        Continue your language learning journey
      </p>
    </div>
  );
}
