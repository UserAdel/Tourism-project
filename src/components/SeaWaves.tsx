const backWave =
  'M0 54 C180 10 360 96 540 52 C720 8 900 94 1080 50 C1260 6 1380 68 1440 54 L1440 120 L0 120 Z ' +
  'M1440 54 C1620 10 1800 96 1980 52 C2160 8 2340 94 2520 50 C2700 6 2820 68 2880 54 L2880 120 L1440 120 Z';

const middleWave =
  'M0 70 C200 34 350 104 560 66 C770 28 930 102 1130 64 C1300 32 1390 62 1440 70 L1440 120 L0 120 Z ' +
  'M1440 70 C1640 34 1790 104 2000 66 C2210 28 2370 102 2570 64 C2740 32 2830 62 2880 70 L2880 120 L1440 120 Z';

const frontWave =
  'M0 88 C210 54 390 108 590 82 C800 54 970 108 1170 82 C1320 62 1400 78 1440 88 L1440 120 L0 120 Z ' +
  'M1440 88 C1650 54 1830 108 2030 82 C2240 54 2410 108 2610 82 C2760 62 2840 78 2880 88 L2880 120 L1440 120 Z';

export default function SeaWaves() {
  return (
    <div className="sea-waves" aria-hidden="true">
      <svg
        className="sea-wave sea-wave-back"
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
      >
        <path d={backWave} />
      </svg>
      <svg
        className="sea-wave sea-wave-middle"
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
      >
        <path d={middleWave} />
      </svg>
      <svg
        className="sea-wave sea-wave-front"
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
      >
        <path d={frontWave} />
      </svg>
    </div>
  );
}
