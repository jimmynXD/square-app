export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy describes how SquareLord (&ldquo;we&rdquo;,
          &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, and protects
          your information when you use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Account information when you sign in</li>
          <li>Email address</li>
          <li>Usage data and preferences</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Google Account Access</h2>
        <p className="mb-4">
          You can manage your Google Account access and permissions at any time
          by visiting{' '}
          <a
            href="https://myaccount.google.com/permissions"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Account Settings
          </a>
          .
        </p>
        <p className="mb-4">
          Learn more about{' '}
          <a
            href="https://safety.google/privacy/data-sharing-controls/"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            how Google helps you share your data safely
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at privacy@squarelord.com
        </p>
      </section>
    </div>
  );
}
