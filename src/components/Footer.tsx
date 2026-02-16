export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ivory-mid/50 py-10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Decorative divider */}
        <div className="divider-nouveau mb-8">
          <span>🌿</span>
        </div>

        <p className="font-display text-xl text-gold mb-2">Adam &amp; Mady</p>
        <p className="font-heading text-sm text-bark-light tracking-wider">
          July 10th, 2027 · Tall Johns House
        </p>

        <p className="font-body text-xs text-bark-light/60 mt-6">
          Made with love (and a lot of code) · Leonard approves 🐾
        </p>
      </div>
    </footer>
  );
}
