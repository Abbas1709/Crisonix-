// src/features/home/pages/Home.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, HeartPulse, Shield, Users } from 'lucide-react'
import useAuthStore from '../../../store/authStore'
import bgImage from '../../../assets/background.png'
import Navbar from '../../../components/common/Navbar'
import Footer from '../../../components/common/Footer'
import Button from '../../../components/common/Button'
import Text from '../../../components/common/Text'
import FeatureSection from '../components/FeatureSection'
import { featureSections, reviews } from '../../../data/homeData'

const howItWorks = [
    {
        title: 'Detect & Report',
        description: 'Crises are detected through user reports and verified data sources such as weather and disaster alerts.',
        icon: <Shield className="w-8 h-8 text-brand-accent" />,
        bgColor: 'bg-[#00e6ff]/10',
    },
    {
        title: 'Analyze Severity',
        description: 'The system analyzes location, type of crisis, and urgency to understand the level of risk.',
        icon: <Activity className="w-8 h-8 text-brand-accent" />,
        bgColor: 'bg-[#00e6ff]/10',
    },
    {
        title: 'Smart Matching',
        description: 'Nearby volunteers and NGOs are intelligently matched based on availability and resources.',
        icon: <Users className="w-8 h-8 text-brand-accent" />,
        bgColor: 'bg-[#00e6ff]/10',
    },
    {
        title: 'Act & Support',
        description: 'Help is delivered, progress is tracked, and updates are shared until the crisis is resolved.',
        icon: <HeartPulse className="w-8 h-8 text-brand-accent" />,
        bgColor: 'bg-[#00e6ff]/10',
    },
]

const Home = () => {
    const navigate = useNavigate()
    const { role, setRole, isAuthenticated, logout } = useAuthStore()

    // Section Refs
    const homeRef = useRef(null)
    const howItWorksRef = useRef(null)
    const peopleInNeedRef = useRef(null)
    const volunteersRef = useRef(null)
    const ngoRef = useRef(null)

    const refs = {
        homeRef,
        howItWorksRef,
        peopleInNeedRef,
        volunteersRef,
        ngoRef
    }

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleRoleNavigation = (path, roleName) => {
        setRole(roleName)
        navigate(path)
    }

    // Attach section refs to featureSections data
    const sectionRefs = [peopleInNeedRef, volunteersRef, ngoRef]
    const sectionsWithRefs = featureSections.map((section, index) => ({
        ...section,
        sectionRef: sectionRefs[index],
    }))

    return (
        <div ref={homeRef} className="min-h-screen bg-black text-white selection:bg-brand-accent/30">
            <Navbar scrollToSection={scrollToSection} refs={refs} />

            {/* Hero Section */}
            <main className="pt-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="max-w-4xl">
                    <Text variant="h1" className="mb-3">
                        AI-Powered Disaster & Crisis Resilience Platform
                    </Text>
                    <Text variant="h3" className="mb-4">
                        Connecting people, volunteers, and NGOs to respond faster and save lives during emergencies.
                    </Text>

                    <div className="max-w-2xl mb-5">
                        <Text variant="caption" className="text-white/70">
                            Our platform uses real-time data, intelligent systems, and
                            community support to manage disasters like floods, earthquakes,
                            fires, and medical emergencies.
                        </Text>
                        <Text variant="caption" className="text-white/70">
                            It helps people get aid quickly
                            while enabling volunteers and NGOs to coordinate effectively.
                        </Text>
                    </div>

                    {!isAuthenticated && (
                        <div className="flex flex-wrap gap-4 mb-8">
                            <Button
                                variant="teal"
                                onClick={() => handleRoleNavigation('/login', 'Affected User')}
                            >
                                Get Help Now
                            </Button>
                            <Button
                                variant="light-teal"
                                onClick={() => handleRoleNavigation('/login', 'Volunteer')}
                            >
                                Join as Volunteer
                            </Button>
                        </div>
                    )}
                </div>

                {/* Hero Image */}
                <div className='md:pr-40 mt-5'>
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl">
                        <img
                            src={bgImage}
                            alt="Global Crisis Coordination Map"
                            className="w-full aspect-[7/3] object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <Text variant="logo" className="text-2xl md:text-4xl uppercase tracking-[0.5em] md:tracking-[1em] text-white/40">
                                Crisonix
                            </Text>
                        </div>
                    </div>
                </div>

                {/* How it works Section */}
                <section ref={howItWorksRef} className="py-24 md:py-32">
                    <Text variant="h2" className="mb-16">How it works</Text>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {howItWorks.map((item, index) => (
                            <div
                                key={index}
                                className="group relative p-6 md:p-8 rounded-3xl bg-[#0d171d]/40 border border-white/5 hover:border-brand-accent/30 hover:bg-[#0d171d]/60 hover:-translate-y-2 transition-all duration-500 shadow-xl overflow-hidden flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-0"
                            >
                                {/* Decorative Glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-[80px] group-hover:bg-brand-accent/20 transition-all duration-500"></div>

                                {/* Icon Wrapper */}
                                <div className={`flex-shrink-0 w-20 h-20 md:w-full md:aspect-video mb-0 md:mb-6 rounded-2xl ${item.bgColor} flex items-center justify-center overflow-hidden border border-white/5`}>
                                    <div className="transform group-hover:scale-110 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Text Wrapper */}
                                <div className="flex-1 text-left">
                                    <Text variant="h3" className="mb-2 md:mb-3 group-hover:text-brand-accent transition-colors">
                                        {item.title}
                                    </Text>
                                    <Text variant="caption">
                                        {item.description}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feature Sections */}
                {sectionsWithRefs.map((section, index) => (
                    <FeatureSection
                        key={index}
                        {...section}
                        isAuthenticated={isAuthenticated}
                        onAuthClick={handleRoleNavigation}
                    />
                ))}

                {/* User Reviews Section */}
                <section className="py-24 md:py-32">
                    <Text variant="h2" className="mb-16">User reviews</Text>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-[#008a99]/20 border border-white/5 hover:border-brand-accent/30 transition-all duration-300 shadow-lg">
                                <Text variant="p" className="font-medium mb-8 leading-relaxed italic">
                                    "{review.quote}"
                                </Text>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-white/40" />
                                    </div>
                                    <div>
                                        <Text variant="p" className="font-bold leading-tight">
                                            {review.name}
                                        </Text>
                                        <Text variant="caption" className="uppercase tracking-wider opacity-60">
                                            user description
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer scrollToSection={scrollToSection} homeRef={homeRef} />
        </div>
    )
}

export default Home
