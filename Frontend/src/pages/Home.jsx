import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroBg from "../assets/HomePage.png";
import sectionBg from "../assets/EasyHairDates.png";
import "../styles/Home.css";
import { services, reasons, stat } from "../data/homeData";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar?.classList.add("navbar--scrolled");
        navbar?.classList.remove("navbar--transparent");
      } else {
        navbar?.classList.add("navbar--transparent");
        navbar?.classList.remove("navbar--scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate on scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );
    elements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleCTA = () => {
    if (user) {
      navigate("/employees");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="home__hero">
        <div
          className="home__hero-bg"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="home__hero-overlay" />

        <div className="home__hero-content container">
          <p className="text-eyebrow home__hero-eyebrow">
            ✦ Bilbao · Since. 2026
          </p>

          <h1 className="home__hero-title">
            El Arte
            <br />
            de <em>Lucir</em>
            <br />
            Impecable
          </h1>

          <p className="home__hero-subtitle">
            Donde la tradición encuentra la excelencia moderna. Reserva
            tu cita y vive la experiencia.
          </p>

          <div className="home__hero-actions">
            <button className="btn btn--primary btn--lg" onClick={handleCTA}>
              Reservar Ahora
            </button>
            <button
              className="btn btn--ghost btn--lg"
              onClick={() =>
                document
                  .querySelector(".home__services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Nuestros Servicios
            </button>
          </div>

          {/* Stats */}
          <div className="home__hero-stats">
            {stat.map((st) => (
              <div key={st.label} className="home__stat">
                <span className="home__stat-value">{st.value}</span>
                <span className="home__stat-label">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="home__scroll-indicator">
          <span className="home__scroll-text">Scroll</span>
          <div className="home__scroll-line" />
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="home__services section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <p className="text-eyebrow section-header__eyebrow">
              Lo que ofrecemos
            </p>
            <h2 className="home__section-title">
              Servicios de
              <br />
              <em>Alta Calidad</em>
            </h2>
            <div className="section-header__divider" />
          </div>

          <div className="home__services-grid">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="home__service-card animate-on-scroll"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="home__service-icon">{service.icon}</div>
                <div className="home__service-content">
                  <h3 className="home__service-title">{service.title}</h3>
                  <p className="home__service-desc">{service.description}</p>
                </div>
                <div className="home__service-price">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGEN CENTRAL ── */}
      <section className="home__mid-image">
        <div
          className="home__mid-image-bg"
          style={{ backgroundImage: `url(${sectionBg})` }}
        />
        <div className="home__mid-image-overlay" />
        <div className="home__mid-image-content animate-on-scroll">
          <div className="ornament">
            <div className="ornament__diamond" />
          </div>
          <blockquote className="home__quote">
            "Tu pelo es la corona que nunca te quitas.
            <br />
            <em>Cuídalo como merece.</em>"
          </blockquote>
          <div className="ornament">
            <div className="ornament__diamond" />
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="home__reasons section">
        <div className="container">
          <div className="home__reasons-inner">
            <div className="home__reasons-header animate-on-scroll">
              <p className="text-eyebrow">Por qué elegirnos</p>
              <h2 className="home__section-title">
                Excelencia en
                <br />
                <em>cada detalle</em>
              </h2>
              <p className="home__reasons-body">
                En /* Nombre Del Comercio */ no solo cortamos pelo. Creamos una experiencia
                que comienza desde el momento en que reservas tu cita.
              </p>
              <button
                className="btn btn--secondary"
                onClick={handleCTA}
                style={{ marginTop: "var(--space-8)" }}
              >
                Reservar mi cita
              </button>
            </div>

            <div className="home__reasons-list">
              {reasons.map((reason, i) => (
                <div
                  key={reason.number}
                  className="home__reason animate-on-scroll"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <span className="home__reason-number">{reason.number}</span>
                  <div className="home__reason-content">
                    <h4 className="home__reason-title">{reason.title}</h4>
                    <p className="home__reason-body">{reason.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="home__cta section">
        <div className="container">
          <div className="home__cta-inner animate-on-scroll">
            <p className="text-eyebrow">¿Listo para el cambio?</p>
            <h2 className="home__cta-title">
              Tu mejor versión
              <br />
              <em>te espera</em>
            </h2>
            <p className="home__cta-subtitle">
              Reserva en menos de 60 segundos. Sin llamadas, sin esperas.
            </p>
            <button className="btn btn--primary btn--lg" onClick={handleCTA}>
              Reservar Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
