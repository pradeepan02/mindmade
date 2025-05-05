import { useNavigate } from "react-router-dom";
import {
  Code,
  Smartphone,
  ShoppingCart,
  ClipboardList,
  Users,
  Terminal,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState, useEffect } from "react";
import mindImage from "../assets/mind.webp";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };


  const services = [
    {
      icon: <Code className="h-10 w-10 text-blue-600" />,
      title: "Web Development Solutions",
      description:
        "Custom websites and web applications tailored to your business needs",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-blue-600" />,
      title: "App Development Services",
      description:
        "Native and cross-platform mobile applications for iOS and Android",
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-blue-600" />,
      title: "E-commerce Solutions",
      description:
        "Complete online store setups with payment integration and inventory management",
    },
    {
      icon: <ClipboardList className="h-10 w-10 text-blue-600" />,
      title: "Project Management Tools",
      description:
        "Custom software to streamline your team's workflow and productivity",
    },
    {
      icon: <Terminal className="h-10 w-10 text-blue-600" />,
      title: "IT Consultancy Services",
      description: "Expert advice to optimize your technology infrastructure",
    },
    {
      icon: <Code className="h-10 w-10 text-blue-600" />,
      title: "Custom Software Development",
      description:
        "Tailor-made solutions designed specifically for your business processes",
    },
  ];

  const testimonials = [
    {
      quote:
        "Mindmade Technologies transformed our business with their innovative solutions. Their team was professional and delivered beyond our expectations.",
      author: "Sarah Johnson",
      position: "CEO, TechFront Solutions",
    },
    {
      quote:
        "Working with Mindmade was a game-changer for our company. Their attention to detail and technical expertise helped us launch our platform months ahead of schedule.",
      author: "Michael Chen",
      position: "CTO, NextGen Retail",
    },
    {
      quote:
        "The team at Mindmade understands business needs and translates them into technological solutions perfectly. I couldn't be happier with the results.",
      author: "Lisa Rodriguez",
      position: "Operations Director, Global Logistics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className={`font-bold text-2xl ${
                  isScrolled ? "text-blue-700" : "text-white"
                }`}
              >
                Mindmade
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#services"
                className={`${
                  isScrolled ? "text-gray-700" : "text-white"
                } hover:text-blue-500 transition duration-300`}
              >
                Services
              </a>
              <a
                href="#about"
                className={`${
                  isScrolled ? "text-gray-700" : "text-white"
                } hover:text-blue-500 transition duration-300`}
              >
                About
              </a>
              <a
                href="#testimonials"
                className={`${
                  isScrolled ? "text-gray-700" : "text-white"
                } hover:text-blue-500 transition duration-300`}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className={`${
                  isScrolled ? "text-gray-700" : "text-white"
                } hover:text-blue-500 transition duration-300`}
              >
                Contact
              </a>
            </div>
           
          </div>
        </div>
      </nav>

      {/* Hero Section with animated gradient background */}
      <header className="relative bg-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container relative mx-auto px-6 py-32 md:py-40 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Innovative{" "}
              <span className="text-blue-300">Digital Solutions</span> for Your
              Business Growth
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100">
              We create cutting-edge software that transforms ideas into
              powerful digital experiences
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleLoginClick}
                className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
              >
                Login to HR System
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-700 transition duration-300 transform hover:-translate-y-1"
              >
                Employee Login
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </header>

      {/* Services Section with hover effects */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600">
              We offer comprehensive digital solutions tailored to meet your
              business objectives and drive growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600"
              >
                <div className="flex justify-center mb-6 bg-blue-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {service.description}
                </p>
                <div className="text-center">
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Counter Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">
                Global Clients
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">
                Projects Delivered
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">
                Team Members
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-blue-200 uppercase tracking-wider text-sm">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section with improved layout */}
      <section id="about" className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <div className="md:w-1/2 mb-10 md:mb-0 relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600 opacity-10 rounded-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 opacity-10 rounded-lg"></div>
              <img
                src={mindImage}
                alt="Mindmade Technologies Team"
                className="rounded-lg shadow-xl w-full object-cover relative z-10"
              />
            </div>
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                About Us
              </h2>
              <div className="w-16 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mindmade Technologies is a leading software development company
                dedicated to delivering innovative digital solutions that drive
                business growth and operational efficiency.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2015, we've grown from a small startup to a trusted
                partner for businesses across various industries. Our team of
                experienced developers, designers, and strategists work together
                to create solutions that make a real difference.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-600 text-2xl mb-1">50+</h4>
                  <p className="text-gray-600">Clients Worldwide</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-600 text-2xl mb-1">
                    100+
                  </h4>
                  <p className="text-gray-600">Projects Completed</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-600 text-2xl mb-1">30+</h4>
                  <p className="text-gray-600">Team Members</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-600 text-2xl mb-1">8</h4>
                  <p className="text-gray-600">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              What Our Clients Say
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600">
              Don't take our word for it - hear what our clients have to say
              about working with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="relative bg-gray-50 p-10 rounded-xl shadow-lg border-t-4 border-blue-600">
              <div className="text-blue-600 text-6xl absolute top-4 left-6 opacity-20">
                "
              </div>
              <div className="relative z-10">
                <p className="text-gray-700 text-lg italic mb-6">
                  {testimonials[activeTestimonial].quote}
                </p>
                <div className="flex items-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[activeTestimonial].author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">
                      {testimonials[activeTestimonial].author}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[activeTestimonial].position}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full mx-2 ${
                    index === activeTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - New */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600">
              Have a project in mind? We'd love to hear from you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Our Location</h3>
              <p className="text-gray-600">
                123 Innovation Drive
                <br />
                Tech City, CA 94043
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">
                info@mindmadetech.com
                <br />
                support@mindmadetech.com
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">
                +1 (555) 123-4567
                <br />
                +1 (555) 987-6543
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with improved design */}
      <section className="py-20 bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Contact us today to discuss how we can help you achieve your digital
            goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleLoginClick}
              className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
            >
              Login to HR System
            </button>
            <button
              onClick={handleLoginClick}
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-blue-700 transition duration-300 transform hover:-translate-y-1"
            >
              Employee Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer with improved layout */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Mindmade Technologies</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                We're passionate about creating innovative digital solutions
                that drive business growth and operational efficiency.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Mindmade Technologies. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


