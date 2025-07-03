'use client';

import { useState, useEffect } from 'react';

export default function TermsOfServicePage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p>Last updated: {currentDate}</p>

          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Imagen Max BrainAi website (the "Service") operated by Imagen Max BrainAi ("us", "we", or "our").
          </p>

          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2 className="text-2xl font-bold mt-6">Accounts</h2>
          <p>
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2 className="text-2xl font-bold mt-6">Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through the Service.
          </p>
          <p>
            By using the service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, process, adapt, modify, publish, transmit, display and distribute the content you generate for the purposes of operating, developing, and improving our services.
          </p>

          <h2 className="text-2xl font-bold mt-6">Prohibited Uses</h2>
          <p>
            You may not use the Service to generate content that is illegal, harmful, harassing, defamatory, or that infringes on the rights of others. This includes, but is not limited to, creating non-consensual explicit imagery, hateful content, or content that promotes violence or self-harm. Violation of these rules will result in immediate termination of your account.
          </p>

          <h2 className="text-2xl font-bold mt-6">Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6">Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-bold mt-6">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us via our <a href="/contact" className="text-primary hover:underline">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
