import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Scissors,
  Sparkles,
  Crown,
  ShieldCheck,
  Clock,
  Droplets,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion"

export default function WhyChooseUsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const reasons = [
    {
      icon: <Scissors className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "Master Barbers",
      description:
        "Our team of award-winning barbers bring international training and decades of expertise, delivering precision cuts tailored to your face shape and style.",
      position: "left",
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "Premium Products",
      description:
        "We exclusively use luxury grooming products from the world's finest brands, ensuring your skin and hair receive the highest quality care.",
      position: "left",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "VIP Lounge",
      description:
        "Step into our exclusive private lounge with complimentary beverages and a serene ambiance designed to make every visit feel like a retreat.",
      position: "left",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "Beard Artistry",
      description:
        "From sculpted fades to traditional straight-razor finishes, our beard specialists craft precision styles that define your look with masterful attention to detail.",
      position: "right",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "Flexible Hours",
      description:
        "Open 7 days a week with early morning and late evening appointments — we fit seamlessly into even the busiest gentleman's schedule.",
      position: "right",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#D4AF37]/60" />,
      title: "Hygiene First",
      description:
        "Every tool is sterilized, every station sanitized, and disposable materials used where needed — your health and safety are never compromised.",
      position: "right",
    },
  ]

  const stats = [
    { icon: <Award />, value: 12, label: "Years Experience", suffix: "+" },
    { icon: <Users />, value: 50, label: "Happy Clients", suffix: "K+" },
    { icon: <Star />, value: 4.9, label: "Client Rating", suffix: "", decimals: 1 },
    { icon: <TrendingUp />, value: 98, label: "Satisfaction Rate", suffix: "%" },
  ]

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="w-full py-24 px-4 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] text-white overflow-hidden relative"
    >
      {/* Top gold separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* Decorative background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#D4AF37]/3 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#D4AF37]/30"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-[#D4AF37]/20"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <motion.span
            className="text-[#D4AF37] font-medium mb-2 flex items-center gap-2 text-xs tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="w-4 h-4" />
            THE CHELSEA DIFFERENCE
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center text-white">
            Why Choose Us
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#E5C76B]"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p className="text-center max-w-2xl mx-auto mb-16 text-[#A3A3A3] text-sm leading-relaxed" variants={itemVariants}>
          Founded on the belief that every gentleman deserves an exceptional grooming experience,
          Chelsea Man Spa brings London's finest barbering traditions to Dubai's most discerning clientele.
          Every detail is curated to deliver luxury, precision, and relaxation.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Left Column */}
          <div className="space-y-16">
            {reasons
              .filter((r) => r.position === "left")
              .map((reason, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={reason.icon}
                  secondaryIcon={reason.secondaryIcon}
                  title={reason.title}
                  description={reason.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="left"
                />
              ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first md:order-none mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div
                className="rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/10 border border-white/5"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <img
                  src="/images/image1.jpg"
                  alt="Chelsea Man Spa Interior"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent flex items-end justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button
                    className="gold-btn px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute inset-0 border-2 border-[#D4AF37]/30 rounded-2xl -m-3 z-[-1]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />

              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-8 w-16 h-16 rounded-full bg-[#D4AF37]/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ y: y1 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-10 w-20 h-20 rounded-full bg-[#D4AF37]/5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={{ y: y2 }}
              />

              {/* Additional decorative dots */}
              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#D4AF37]"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D4AF37]/50"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-16">
            {reasons
              .filter((r) => r.position === "right")
              .map((reason, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={reason.icon}
                  secondaryIcon={reason.secondaryIcon}
                  title={reason.title}
                  description={reason.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="right"
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
              decimals={stat.decimals}
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 glass-card-gold rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-display font-bold mb-2 text-white">Ready to experience the difference?</h3>
            <p className="text-[#A3A3A3] text-sm">Book your appointment today and discover why Dubai's gentlemen choose Chelsea.</p>
          </div>
          <motion.button
            className="gold-btn px-8 py-3.5 rounded-full flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Appointment <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

interface ServiceItemProps {
  icon: React.ReactNode
  secondaryIcon?: React.ReactNode
  title: string
  description: string
  variants: {
    hidden: { opacity: number; y?: number }
    visible: { opacity: number; y?: number; transition: { duration: number; ease: string } }
  }
  delay: number
  direction: "left" | "right"
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="text-[#D4AF37] bg-[#D4AF37]/10 p-3 rounded-xl transition-colors duration-300 group-hover:bg-[#D4AF37]/20 relative"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-sm text-[#A3A3A3] leading-relaxed pl-[60px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-3 pl-[60px] flex items-center text-[#D4AF37] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
      >
        <span className="flex items-center gap-1">
          Learn more <ArrowRight className="w-3 h-3" />
        </span>
      </motion.div>
    </motion.div>
  )
}

interface StatCounterProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
  delay: number
  decimals?: number
}

function StatCounter({ icon, value, label, suffix, delay, decimals = 0 }: StatCounterProps) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false)
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest).toString()
  )

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 flex flex-col items-center text-center group hover:border-[#D4AF37]/30 transition-all duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-3xl font-bold text-white flex items-center">
        <motion.span>{displayValue}</motion.span>
        <span className="gold-gradient-text">{suffix}</span>
      </motion.div>
      <p className="text-[#A3A3A3] text-sm mt-1">{label}</p>
      <motion.div className="w-10 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] mt-3 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  )
}
