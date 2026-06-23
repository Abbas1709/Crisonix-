// src/features/home/components/FeatureSection.jsx
import React from 'react';
import Button from '../../../components/common/Button';
import Text from '../../../components/common/Text';

const FeatureSection = ({
    sectionRef,
    title,
    features,
    imageSrc,
    imageAlt,
    imagePosition = 'right',
    isAuthenticated,
    onAuthClick
}) => {
    const isImageLeft = imagePosition === 'left';

    const contentClasses = `flex-1 text-left ${isImageLeft ? 'md:order-2' : ''}`;
    const imageContainerClasses = `flex-1 w-full aspect-video md:aspect-square md:aspect-[4/3] rounded-3xl bg-[#008a99] overflow-hidden border border-white/10 shadow-2xl group ${isImageLeft ? 'md:order-1' : ''}`;

    return (
        <section ref={sectionRef} className="py-24 md:py-32">
            <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row'} items-center gap-12 lg:gap-24`}>
                <div className={contentClasses}>
                    <Text variant="h2" className="mb-8">{title}</Text>

                    <div className="space-y-6 mb-10">
                        {features.map((feature, index) => (
                            <div key={index}>
                                <Text variant="h3" className="mb-1">{feature.title}</Text>
                                <Text variant="caption">{feature.description}</Text>
                            </div>
                        ))}
                    </div>

                    {!isAuthenticated && (
                        <div className="flex gap-4">
                            <Button
                                variant="teal"
                                className="px-10"
                                onClick={() => onAuthClick('/login', title.includes('People') ? 'Affected User' : title.includes('Volunteer') ? 'Volunteer' : 'NGO / Organisation')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="light-teal"
                                className="px-10"
                                onClick={() => onAuthClick('/signup', title.includes('People') ? 'Affected User' : title.includes('Volunteer') ? 'Volunteer' : 'NGO / Organisation')}
                            >
                                Sign up
                            </Button>
                        </div>
                    )}
                </div>

                <div className={imageContainerClasses}>
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
