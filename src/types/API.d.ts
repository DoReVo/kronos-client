export declare namespace ZoneOptionResponse {
  export interface Response {
    Johor: Johor;
    Kedah: Kedah;
    Kelantan: Kelantan;
    Melaka: Melaka;
    "Negeri Sembilan": NegeriSembilan;
    Pahang: Pahang;
    Perlis: Perlis;
    "Pulau Pinang": PulauPinang;
    Perak: Perak;
    Sabah: Sabah;
    Selangor: Selangor;
    Sarawak: Sarawak;
    Terengganu: Terengganu;
    "Wilayah Persekutuan": WilayahPersekutuan;
  }

  interface WilayahPersekutuan {
    WLY01: string;
    WLY02: string;
  }

  interface Terengganu {
    TRG01: string;
    TRG02: string;
    TRG03: string;
    TRG04: string;
  }

  interface Sarawak {
    SWK01: string;
    SWK02: string;
    SWK03: string;
    SWK04: string;
    SWK05: string;
    SWK06: string;
    SWK07: string;
    SWK08: string;
    SWK09: string;
  }

  interface Selangor {
    SGR01: string;
    SGR02: string;
    SGR03: string;
  }

  interface Sabah {
    SBH01: string;
    SBH02: string;
    SBH03: string;
    SBH04: string;
    SBH05: string;
    SBH06: string;
    SBH07: string;
    SBH08: string;
    SBH09: string;
  }

  interface Perak {
    PRK01: string;
    PRK02: string;
    PRK03: string;
    PRK04: string;
    PRK05: string;
    PRK06: string;
    PRK07: string;
  }

  interface PulauPinang {
    PNG01: string;
  }

  interface Perlis {
    PLS01: string;
  }

  interface Pahang {
    PHG01: string;
    PHG02: string;
    PHG03: string;
    PHG04: string;
    PHG05: string;
    PHG06: string;
  }

  interface NegeriSembilan {
    NGS01: string;
    NGS02: string;
  }

  interface Melaka {
    MLK01: string;
  }

  interface Kelantan {
    KTN01: string;
    KTN03: string;
  }

  interface Kedah {
    KDH01: string;
    KDH02: string;
    KDH03: string;
    KDH04: string;
    KDH05: string;
    KDH06: string;
    KDH07: string;
  }

  interface Johor {
    JHR01: string;
    JHR02: string;
    JHR03: string;
    JHR04: string;
  }
}

export declare namespace PrayerTimeResponse {
  interface Response {
    date: string;
    imsak: string;
    fajr: string;
    syuruk: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }
}
