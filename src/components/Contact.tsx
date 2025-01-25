const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Have a project in mind? Let's work together.
        </p>
        <a
          href="mailto:hello@braden.com.au"
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg transition-transform hover:-translate-y-1"
        >
          Say Hello
        </a>
      </div>
    </section>
  );
};

export default Contact;