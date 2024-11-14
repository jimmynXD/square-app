export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using SquareLord (&ldquo;Service&rdquo;), you accept
          and agree to be bound by these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. Description of Service
        </h2>
        <p className="mb-4">
          SquareLord is a platform that allows users to create, manage, and
          participate in squares pools for sporting events.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Google Account</h2>
        <p className="mb-4">
          Our service uses Google Sign-In for authentication. By using our
          service, you agree to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate Google Account information</li>
          <li>Maintain the security of your account</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
        <p className="mb-4">You agree not to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Use the service for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to the service</li>
          <li>Interfere with or disrupt the service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
        <p className="mb-4">
          For any questions about these Terms, please contact us at
          terms@squarelord.com
        </p>
      </section>
    </div>
  );
}
