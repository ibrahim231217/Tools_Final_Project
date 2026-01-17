import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { number: 1, name: 'Sign In', path: '/login', active: step1 },
    { number: 2, name: 'Shipping', path: '/shipping', active: step2 },
    { number: 3, name: 'Payment', path: '/payment', active: step3 },
    { number: 4, name: 'Place Order', path: '/placeorder', active: step4 },
  ];

  return (
    <nav className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {index > 0 && (
            <div className={`h-0.5 w-12 ${step.active ? 'bg-[#B08D55]' : 'bg-[#2c2926]/10'} transition-colors`} />
          )}
          {step.active ? (
            <Link
              to={step.path}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#B08D55] flex items-center justify-center text-white font-bold shadow-lg">
                <CheckCircle size={20} />
              </div>
              <span className="text-xs font-bold text-[#B08D55] uppercase tracking-wider">
                {step.name}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-10 h-10 rounded-full bg-[#2c2926]/10 flex items-center justify-center text-secondary font-bold">
                {step.number}
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                {step.name}
              </span>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CheckoutSteps;
