import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import heroVisual from '@/assets/hero-visual.png'

export default function Hero() {
    return (
        <section
            style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', overflow: 'hidden' }}
        >
            <div
                className="section-container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '48px',
                    // Padding atas: navbar height (52px mobile / 60px desktop) + top offset (16px) + breathing room (24px)
                    paddingTop: '92px',
                    paddingBottom: '48px',
                }}
            >
                {/* Inner row: stacks on mobile, side-by-side on desktop */}
                <div
                    className="hero-inner"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '40px',
                        width: '100%',
                    }}
                >
                    {/* ─── GAMBAR — atas di mobile, kanan di desktop ─── */}
                    <div
                        className="order-first lg:order-last"
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%' }}
                    >
                        <motion.div
                            initial={{ rotate: 0, opacity: 0, x: 40 }}
                            whileInView={{ rotate: -3, opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.25 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '480px',
                                aspectRatio: '16/9',
                                borderRadius: '24px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={heroVisual}
                                alt="Mathshape Visual"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </motion.div>
                    </div>

                    {/* ─── TEKS — bawah di mobile, kiri di desktop ─── */}
                    <div
                        className="hero-text-col"
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '24px',
                        }}
                    >
                        <motion.div
                            className="hero-text-inner"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.25 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}
                        >
                            {/* Heading — 32px */}
                            <h1
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '32px',
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    color: 'var(--color-text)',
                                    margin: 0,
                                }}
                            >
                                Belajar jadi lebih mudah dan menyenangkan
                            </h1>

                            {/* Body text — 16px */}
                            <p
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '16px',
                                    color: 'var(--color-text-light)',
                                    maxWidth: '480px',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                Bangun fondasi matematika yang kuat melalui urutan materi yang sistematis,
                                bantu kamu paham tanpa perlu sekadar menghafal rumus.
                            </p>

                            {/* Tombol — side by side */}
                            <div className="hero-btn-row" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link to={ROUTES.MATERIALS}>
                                    <Button variant="primary" size="lg">
                                        Mulai sekarang
                                    </Button>
                                </Link>
                                <Link to={ROUTES.GUIDE}>
                                    <Button variant="outline" size="lg">
                                        Lihat panduan
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
              @media (min-width: 768px) {
                .hero-btn-row {
                  flex-direction: row !important;
                }
              }
              @media (min-width: 1024px) {
                .hero-inner {
                  flex-direction: row !important;
                  align-items: center !important;
                }
                .hero-text-col {
                  align-items: flex-start !important;
                  text-align: left !important;
                  max-width: 520px;
                }
                .hero-text-inner {
                  align-items: flex-start !important;
                  text-align: left !important;
                }
                .hero-btn-row {
                  flex-direction: row !important;
                }
              }
            `}</style>
        </section>
    )
}