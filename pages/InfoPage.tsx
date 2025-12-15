import React from 'react';

interface InfoPageProps {
  title: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ title }) => {
  const getContent = () => {
    switch (title) {
      case 'Shipping & Returns':
        return (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Policy</h3>
            <p className="mb-6">We offer secure, insured shipping on all orders. Deliveries within Lagos take 1-2 business days, while interstate deliveries take 3-5 business days. International shipping is available upon request.</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Returns & Exchanges</h3>
            <p>We accept returns within 14 days of delivery for unworn items in their original packaging. Custom pieces and earrings (for hygiene reasons) are non-refundable. Please contact our support team to initiate a return.</p>
          </>
        );
      case 'Size Guide':
        return (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ring Sizing</h3>
            <p className="mb-6">Measure your finger at the end of the day when it is largest. Use a strip of paper to measure the circumference and compare with our chart. If you are between sizes, we recommend sizing up.</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Necklace Lengths</h3>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>14" - Choker: Fits closely around the neck</li>
              <li>16" - Collar: Sits at the base of the neck</li>
              <li>18" - Princess: Sits on the collarbone</li>
              <li>20-24" - Matinee: Sits between the collarbone and the bust</li>
              <li>30" - Opera: Hangs below the bust</li>
            </ul>
          </>
        );
      case 'Contact Us':
        return (
          <>
            <p className="mb-6">Our concierge team is available Monday through Saturday, 9am - 6pm WAT to assist with your orders and inquiries.</p>
            <div className="space-y-4">
              <p><strong>Email:</strong> <a href="mailto:concierge@jewelryoclock.com" className="text-amber-600 hover:underline">concierge@jewelryoclock.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+2348000000000" className="text-amber-600 hover:underline">+234 800 JEWELRY</a></p>
              <p><strong>Boutique:</strong> 123 Luxury Lane, Victoria Island, Lagos</p>
              <p><strong>WhatsApp:</strong> <span className="text-green-600">+234 800 123 4567</span></p>
            </div>
          </>
        );
      default:
        return <p>Content coming soon.</p>;
    }
  };

  return (
    <div className="pt-12 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 shadow-sm border border-gray-100">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8 border-b pb-4">{title}</h1>
          <div className="text-gray-600 font-light leading-relaxed text-lg">
            {getContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;