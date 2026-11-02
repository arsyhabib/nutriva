/**
 * Adaptor status memori-saja untuk profil `demo` (ADR-0003, K-13): tidak ada penyimpanan peramban,
 * tidak ada cookie, tidak ada status di URL. Status hilang saat halaman dimuat ulang — sengaja.
 */
export interface AdaptorStatus<T extends object> {
  baca(): Readonly<T>;
  tulis(sebagian: Partial<T>): Readonly<T>;
  ganti(baru: T): Readonly<T>;
  langgan(fn: (s: Readonly<T>) => void): () => void;
}

export function buatStatusMemori<T extends object>(awal: T): AdaptorStatus<T> {
  let kini: T = Object.freeze({ ...awal });
  const pelanggan = new Set<(s: Readonly<T>) => void>();
  const setel = (baru: T): Readonly<T> => {
    kini = Object.freeze({ ...baru });
    for (const fn of pelanggan) fn(kini);
    return kini;
  };
  return {
    baca: () => kini,
    tulis: (sebagian) => setel({ ...kini, ...sebagian }),
    ganti: (baru) => setel(baru),
    langgan(fn) {
      pelanggan.add(fn);
      return () => pelanggan.delete(fn);
    },
  };
}
