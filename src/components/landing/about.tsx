import React from 'react';

interface FeatureItemProps {
  feature: string;
  index: number;
}

const FeatureItem = ({ feature, index }: FeatureItemProps) => (
  <div
    className="flex items-center space-x-4 animate-fade-in"
    style={{ animationDelay: `${index * 0.2}s` }}
  >
    <div className="w-3 h-3 bg-muted rounded-full shadow-lg" />
    <span className="text-xl font-medium text-primary-foreground">{feature}</span>
  </div>
);


const features = [
  "Track your Warranties",
  "Manage Pollution Checkups",
  "Never Miss an Insurance Renewal",
  "Subscription & Bill Tracking"
];

const About = () => (
  <div className="hidden lg:flex lg:w-1/2 text-indigo-900 p-12 flex-col justify-center relative overflow-hidden">
    <div className="absolute inset-0 backdrop-blur-sm" />
    <div className="relative z-10">
      <h1 className="text-6xl font-bold mb-8 leading-tight text-primary-foreground">
        GET-Warranty
      </h1>

      <p className="text-2xl mb-12 opacity-90 font-light text-primary-foreground/90">
        Your premium solution for managing warranties, renewals, and subscriptions
      </p>

      <div className="space-y-6 mb-12">
        {features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} index={index} />
        ))}
      </div>

      <p className="text-xl opacity-80 text-primary-foreground">
        Built with&nbsp;by <span className="font-bold text-violet-800">XyphX</span>
      </p>
    </div>
  </div>
);

export default About;

