import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  direction = 'up',
  distance = 20,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`;
        case 'down': return `translateY(-${distance}px)`;
        case 'left': return `translateX(${distance}px)`;
        case 'right': return `translateX(-${distance}px)`;
        default: return 'none';
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * staggerDelay}s, transform 0.5s ease ${i * staggerDelay}s`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

interface SlideInProps {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SlideIn({ children, isOpen, className = '', direction = 'up' }: SlideInProps) {
  const getTransform = () => {
    if (isOpen) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(100%)';
      case 'down': return 'translateY(-100%)';
      case 'left': return 'translateX(100%)';
      case 'right': return 'translateX(-100%)';
      default: return 'translateY(100%)';
    }
  };

  return (
    <div
      className={className}
      style={{
        transform: getTransform(),
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

export function ScaleIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}
