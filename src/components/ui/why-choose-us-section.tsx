import { useState, useRef } from "react"
import {
  Scissors,
  Sparkles,
  Crown,
  ShieldCheck,
  Clock,
  Droplets,
  Award,
  Users,
  Star,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react"
import { motion, useInView } from "framer-motion"

export default function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const reasons = [
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Master Barbers",
      description:
        "Award-winning barbers with international training, delivering precision cuts tailored to your style.",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Premium Products",
      description:
        "Exclusively using luxury grooming products from the world's finest brands for the highest quality care.",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "VIP Lounge",
      description:
        "Enjoy complimentary beverages in our serene private lounge, making every visit feel like a retreat.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Beard Artistry",
      description:
        "From sculpted fades to traditional straight-razor finishes, precision styles that define your look.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Hours",
      description:
        "Open 7 days a week with early morning and late evening appointments for the busiest schedules.",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Hygiene First",
      description:
        "Every tool sterilized, every station sanitized — your health and safety are never compromised.",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
  ]

  const stats = [
    { icon: <Award />, value: "12+", label: "Years Experience" },
    { icon: <Users />, value: "50K+", label: "Happy Clients" },
    { icon: <Star />, value: "4.9", label: "Client Rating" },
    { icon: <TrendingUp />, value: "98%", label: "Satisfaction" },
  ]

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="w-full py-24 px-6 bg-slate-50"
    >
      <motion.div
        className="container mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="flex flex-col items-center mb-16" variants={itemVariants}>
          <span className="text-amber-500 font-medium mb-2 flex items-center gap-2 text-xs tracking-[0.3em] uppercase">
            <Zap className="w-4 h-4" />
            THE CHELSEA DIFFERENCE
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center text-slate-800">
            Why Choose Us
          </h2>
          <div className="w-24 h-1 bg-amber-500 rounded-full" />
        </motion.div>

        <motion.p
          className="text-center max-w-2xl mx-auto mb-16 text-slate-500 text-sm leading-relaxed"
          variants={itemVariants}
        >
          Founded on the belief that every gentleman deserves an exceptional grooming experience,
          Chelsea Man Spa brings London's finest barbering traditions to Dubai's most discerning clientele.
        </motion.p>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={`w-12 h-12 rounded-xl ${reason.bgColor} flex items-center justify-center mb-4 ${reason.iconColor}`}>
                {reason.icon}
              </div>
              <h3 className="text-slate-800 text-lg font-semibold mb-2">{reason.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3 text-amber-500">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-slate-800 mb-1">Ready to experience the difference?</h3>
            <p className="text-slate-500 text-sm">Book your appointment today and discover why Dubai's gentlemen choose Chelsea.</p>
          </div>
          <button
            className="amber-btn px-8 py-3.5 rounded-full flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
            onClick={() => window.location.href = '/login'}
          >
            Book Appointment <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
